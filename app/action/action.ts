"use server";

import { openRouter } from "@/lib/openrouter";
import { generateText } from "ai";

export async function generateProjectName(prompt: string) {
  try {
    const { text } = await generateText({
      model: openRouter.chat("google/gemini-2.5-flash-lite"),
      system: `
      You are an AI assistant that generates very very short project names based on user prompt.
      - Keep it under 5 words.
      - Capitalize words appropriately.
      - Do not include special characters.`,
      prompt: prompt,
    });

    return text?.trim() || "Untitled Project";
  } catch (error) {
    console.log(error);
    return "Untitled Project";
  }
}
