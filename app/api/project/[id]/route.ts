import { NextRequest, NextResponse } from "next/server";

import { inngest } from "@/inngest/client";
import {
  handlePrismaError,
  notFoundResponse,
  rateLimitResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  checkRateLimit,
  projectDeletionLimiter,
  screenGenerationLimiter,
} from "@/lib/rate-limit";
import {
  getCachedProjectDetail,
  invalidateProjectCache,
  setCachedProjectDetail,
} from "@/lib/redis";
import { canGenerateScreen } from "@/lib/subscription";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) return unauthorizedResponse();

    // Try cache first
    const cached = await getCachedProjectDetail(id);
    if (cached) return successResponse(cached, { cached: true });

    // Cache miss - fetch from database
    const project = await prisma.project.findFirst({
      where: {
        userId: session.user.id,
        id: id,
      },
      include: {
        frames: true,
      },
    });

    if (!project) return notFoundResponse("project");

    // Cache the result
    await setCachedProjectDetail(id, project);

    return successResponse(project);
  } catch (error) {
    return handlePrismaError(error, "fetch project");
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { prompt } = await request.json();

    const session = await auth();

    if (!session?.user?.id) return unauthorizedResponse();

    // Check rate limit
    const limit = await checkRateLimit(
      session.user.id,
      screenGenerationLimiter
    );
    if (!limit.allowed)
      return rateLimitResponse(limit.retryAfter, limit.limit, limit.resetAt);

    if (!prompt || typeof prompt !== "string")
      return validationErrorResponse("Prompt is required and must be a string");

    const userId = session.user.id;
    const project = await prisma.project.findFirst({
      where: {
        userId,
        id: id,
      },
      include: {
        frames: true,
      },
    });

    if (!project) return notFoundResponse("project");

    const canCreate = await canGenerateScreen(userId, id);
    if (!canCreate) {
      return validationErrorResponse(
        "You've reached your screen limit for this project. Upgrade your plan for more screens."
      );
    }

    // Invalidate caches since generation will modify the project
    await invalidateProjectCache(userId, id);

    // Trigger the inngest function to create project
    try {
      await inngest.send({
        name: "ui/generate.screen",
        data: {
          userId: session.user.id,
          projectId: project?.id,
          prompt,
          frames: project?.frames,
          theme: project?.theme,
        },
      });
    } catch (error) {
      console.log("Error triggering inngest function:", error);
    }

    return successResponse(project);
  } catch (error) {
    console.log("Error occurred", error);
    return handlePrismaError(error, "generate screen");
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { themeId } = await request.json();
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    if (!themeId) return validationErrorResponse("Theme ID is required");

    const userId = session.user.id;
    const project = await prisma.project.update({
      where: {
        id,
        userId,
      },
      data: {
        theme: themeId,
      },
    });

    // Invalidate caches
    await invalidateProjectCache(userId, id);

    return successResponse(project);
  } catch (error) {
    console.log("Error occurred", error);
    return handlePrismaError(error, "update project");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    // Check rate limit
    const limit = await checkRateLimit(session.user.id, projectDeletionLimiter);
    if (!limit.allowed) {
      return rateLimitResponse(limit.retryAfter, limit.limit, limit.resetAt);
    }

    const userId = session.user.id;

    // First delete all frames associated with the project
    await prisma.frame.deleteMany({
      where: {
        projectId: id,
      },
    });

    // Then delete the project
    await prisma.project.delete({
      where: {
        id,
        userId,
      },
    });

    // Invalidate caches
    await invalidateProjectCache(userId, id);

    return successResponse({ message: "Project deleted successfully" });
  } catch (error) {
    console.log("Error deleting project:", error);
    return handlePrismaError(error, "delete project");
  }
}
