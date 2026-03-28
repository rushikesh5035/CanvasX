import { NextResponse } from "next/server";

import { generateProjectName } from "@/app/action/action";
import { inngest } from "@/inngest/client";
import {
  handlePrismaError,
  rateLimitResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit, projectCreationLimiter } from "@/lib/rate-limit";
import {
  getCachedProjectList,
  invalidateProjectCache,
  setCachedProjectList,
} from "@/lib/redis";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const session = await auth();
    const user = session?.user;

    if (!user) {
      // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return unauthorizedResponse();
    }

    // Check rate limit
    const limit = await checkRateLimit(user.id, projectCreationLimiter);

    if (!limit.allowed)
      return rateLimitResponse(limit.retryAfter, limit.limit, limit.resetAt);

    if (!prompt || typeof prompt !== "string")
      return validationErrorResponse("Prompt is required and must be a string");

    const userId = session.user.id;

    // Verify user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      console.error("User not found in database:", userId);
      return unauthorizedResponse("User not found. Please sign in again.");
    }

    const projectName = await generateProjectName(prompt);

    const project = await prisma.project.create({
      data: {
        userId,
        name: projectName,
      },
    });

    // Invalidate project list cache
    await invalidateProjectCache(userId);

    // Trigger the inngest function to create project
    try {
      await inngest.send({
        name: "ui/generate.screen",
        data: {
          userId: user.id,
          projectId: project.id,
          prompt,
        },
      });
    } catch (error) {
      console.log("Error triggering inngest function:", error);
    }

    return successResponse(project);
  } catch (error) {
    return handlePrismaError(error, "create project");
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return unauthorizedResponse();
    }

    // Try cache first
    const cached = await getCachedProjectList(session.user.id);
    if (cached) {
      return NextResponse.json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    // Cache miss - fetch from database
    const project = await prisma.project.findMany({
      where: { userId: session.user.id },
      take: 10,
      orderBy: { updatedAt: "desc" },
    });

    // Cache the result
    await setCachedProjectList(session.user.id, project);

    return successResponse(project);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return handlePrismaError(error, "fetch projects");
  }
}
