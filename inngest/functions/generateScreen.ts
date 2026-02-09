import { generateText, Output, stepCountIs } from "ai";

import { AnalysisSchema } from "@/config/analysis-schema";
import { validateGeminiApiKey } from "@/lib/env-check";
import { google } from "@/lib/openrouter";
import prisma from "@/lib/prisma";
import { ANALYSIS_PROMPT, GENERATION_SYSTEM_PROMPT } from "@/lib/prompts";
import { BASE_VARIABLES, THEME_LIST } from "@/lib/themes";
import { FrameType } from "@/types/project";

import { inngest } from "../client";
import { unsplashTool } from "../tool";

export const generateScreen = inngest.createFunction(
  { id: "generate-ui-screen" },
  { event: "ui/generate.screen" },
  async ({ event, step, publish }) => {
    const {
      userId,
      projectId,
      prompt,
      frames,
      theme: existingTheme,
    } = event.data;

    const CHANNEL = `user:${userId}`;

    const isExistingGeneration = Array.isArray(frames) && frames.length > 0;

    try {
      // Validate API key before starting
      if (!validateGeminiApiKey()) {
        await publish({
          channel: CHANNEL,
          topic: "generation.failed",
          data: {
            status: "failed",
            projectId: projectId,
            error:
              "Google Gemini API key is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
          },
        });
        throw new Error("Missing or invalid Google Gemini API key");
      }

      // Notify frontend that generation has started
      await publish({
        channel: CHANNEL,
        topic: "generation.start",
        data: {
          status: "running",
          projectId: projectId,
        },
      });

      // analyze the plan
      const analysis = await step.run("analyze-and-plan-screen", async () => {
        await publish({
          channel: CHANNEL,
          topic: "analysis.start",
          data: {
            status: "analyzing",
            projectId: projectId,
          },
        });

        const contextHTML = isExistingGeneration
          ? frames
              .slice(0, 4)
              .map((frame: FrameType) => frame.htmlContent)
              .join("\n")
          : "";

        const analysisPrompt = isExistingGeneration
          ? `USER REQUEST:${prompt}
        SELECTED THEME:${existingTheme}
        CONTEXT HTML:${contextHTML}`.trim()
          : `USER REQUEST:${prompt}`.trim();

        const { output } = await generateText({
          model: google("gemini-2.5-flash"),
          output: Output.object({
            schema: AnalysisSchema,
          }),
          system: ANALYSIS_PROMPT,
          prompt: analysisPrompt,
        });

        const themeToUse = isExistingGeneration ? existingTheme : output.theme;

        if (!isExistingGeneration) {
          await prisma.project.update({
            where: { id: projectId, userId: userId },
            data: { theme: themeToUse },
          });
        }

        await publish({
          channel: CHANNEL,
          topic: "analysis.complete",
          data: {
            status: "generating",
            theme: themeToUse,
            totalScreens: output.screens.length, // number of screens to generate
            screens: output.screens,
            projectId: projectId,
          },
        });

        return { ...output, themeToUse };
      });

      // Actually generate the screen
      for (let i = 0; i < analysis.screens.length; i++) {
        const screenPlan = analysis.screens[i];
        const selectedTheme = THEME_LIST.find(
          (theme) => theme.id === analysis.themeToUse
        );

        // combined the Theme style + base variables
        const fullThemeCSS = `${BASE_VARIABLES} ${selectedTheme?.style || ""}`;

        await step.run(`generated-screen-${i}`, async () => {
          const result = await generateText({
            model: google("gemini-2.5-flash"),
            system: GENERATION_SYSTEM_PROMPT,
            tools: {
              searchUnsplash: unsplashTool,
            },
            stopWhen: stepCountIs(5),
            prompt: `
# SCREEN SPECIFICATION
- Screen ${i + 1}/${analysis.screens.length}
- Screen ID: ${screenPlan.id}
- Screen Name: ${screenPlan.name}
- Screen Purpose: ${screenPlan.purpose}

# VISUAL DESCRIPTION
${screenPlan.visualDescription}

# THEME VARIABLES (Reference ONLY - already defined in parent, do NOT redeclare these)
${fullThemeCSS}

# CRITICAL IMPLEMENTATION RULES

## Layout & Structure
1. Root container: Use \`relative w-full min-h-screen bg-[var(--background)]\`
2. For list/feed layouts: Use vertical \`grid gap-4 px-4 pb-20\` (NOT flex column)
3. For horizontal scrolling: \`flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden scrollbar-none\`
4. Sticky headers: \`sticky top-0 z-20 bg-[var(--background)]/95 backdrop-blur-lg\`
5. Fixed elements (FAB, bottom nav): Use \`fixed\` with explicit positioning and z-30+

## Card Components
- Restaurant/product cards in lists:
  * Horizontal flex layout: \`flex items-center gap-4\`
  * Image on left: \`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden\`
  * Content on right: \`flex-1 min-w-0\` (prevents overflow)
  * Container: \`bg-[var(--card)] rounded-2xl p-4 shadow-md border border-[var(--border)]\`
- Deal/promo cards:
  * Fixed width: \`w-56 h-36\` with \`flex-shrink-0\`
  * Rounded: \`rounded-2xl\`
  * Overlays: Use \`absolute\` with \`top-3 left-3\` etc.

## Images & Icons
- All icons: \`<iconify-icon icon=\"lucide:NAME\" width=\"20\"></iconify-icon>\`
- Specify icon width explicitly (16-24px)
- Food/product images: MUST use searchUnsplash tool with specific queries
- Avatar images: Use \`https://i.pravatar.cc/150?u=NAME\`
- Images in cards: \`w-full h-full object-cover\`

## Typography & Spacing
- Card titles: \`text-base font-bold text-[var(--foreground)] mb-1.5 truncate\`
- Badges: \`text-xs font-semibold px-2 py-1 rounded-md\`
- Consistent gap: Use 4-unit spacing (gap-4 = 16px, gap-3 = 12px)
- Padding: Cards use \`p-4\`, smaller elements \`px-3 py-1.5\`

## Colors & Visual Effects
- Use CSS variables for ALL theme colors: bg-[var(--card)], text-[var(--foreground)], etc.
- Orange time badges: \`bg-orange-100 dark:bg-orange-950/30 text-orange-700 dark:text-orange-500\`
- Star ratings: \`text-[var(--primary)]\` with lucide:star icon
- Shadows: \`shadow-md\` for cards, \`shadow-lg\` for elevated elements
- Glows on FABs: \`drop-shadow-[0_0_12px_var(--primary)]\`

## Output Format
- Generate ONLY raw HTML starting with \`<div\` and ending with \`</div>\`
- NO markdown code fences, NO comments, NO explanations
- NO \`<html>\`, \`<body>\`, or \`<head>\` tags
- All scrollable sections MUST hide scrollbars: \`[&::-webkit-scrollbar]:hidden scrollbar-none\`

## Data Requirements
- Use real, specific data from the visual description
- Include exact restaurant names, times, ratings as specified
- Search for relevant food images using searchUnsplash with descriptive queries

Generate the complete, production-ready, pixel-perfect HTML for this screen now. Follow the visual description EXACTLY.
      `.trim(),
          });

          let finalHtml = result.text ?? "";
          const match = finalHtml.match(/<div[\s\S]*<\/div>/);
          finalHtml = match ? match[0] : finalHtml;
          finalHtml = finalHtml.replace(/```/g, "");

          // create the frame record in the DB
          const frameRecord = await prisma.frame.create({
            data: {
              projectId: projectId,
              title: screenPlan.name,
              htmlContent: finalHtml,
            },
          });

          // Notify frontend that a frame has been created
          await publish({
            channel: CHANNEL,
            topic: "frame.created",
            data: {
              frame: frameRecord,
              screenId: screenPlan.id,
              projectId: projectId,
            },
          });

          return {
            success: true,
            frame: frameRecord,
          };
        });
      }

      // Notify frontend that generation is complete
      await publish({
        channel: CHANNEL,
        topic: "generation.complete",
        data: {
          status: "completed",
          projectId: projectId,
        },
      });

      // Invalidate caches since project now has new frames
      const { invalidateProjectCache } = await import("@/lib/redis");
      await invalidateProjectCache(userId, projectId);
    } catch (error) {
      console.error("Error in generateScreen function:", error);

      // Determine error message
      let errorMessage = "Generation failed. Please try again.";

      if (error instanceof Error) {
        // Check for API key errors
        if (
          error.message.includes("API key") ||
          error.message.includes("401") ||
          error.message.includes("unauthorized")
        ) {
          errorMessage =
            "Invalid or missing API key. Please check your Google Gemini API key in environment variables.";
        }
        // Check for quota/rate limit errors
        else if (
          error.message.includes("quota") ||
          error.message.includes("429")
        ) {
          errorMessage = "AI service quota exceeded. Please try again later.";
        } else if (error.message.includes("rate limit")) {
          errorMessage =
            "Rate limit exceeded. Please wait a moment and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (
          error.message.includes("network") ||
          error.message.includes("fetch")
        ) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("model")) {
          errorMessage =
            "Model error. The AI model may be unavailable. Please try again.";
        } else {
          // Provide more helpful error message
          errorMessage = `Generation failed: ${error.message.substring(0, 100)}`;
        }
      }

      // Notify frontend of failure with specific error message
      await publish({
        channel: CHANNEL,
        topic: "generation.failed",
        data: {
          status: "failed",
          projectId: projectId,
          error: errorMessage,
        },
      });

      // Re-throw to mark the Inngest function as failed
      throw error;
    }
  }
);
