import { NextRequest, NextResponse } from "next/server";

import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { checkRateLimit, screenGenerationLimiter } from "@/lib/rate-limit";
import {
  getCachedProjectDetail,
  invalidateProjectCache,
  setCachedProjectDetail,
} from "@/lib/redis";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Try cache first
    const cached = await getCachedProjectDetail(id);
    if (cached) {
      return NextResponse.json(cached);
    }

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

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Cache the result
    await setCachedProjectDetail(id, project);

    return NextResponse.json(project);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
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
    const user = session?.user;

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    const limit = await checkRateLimit(
      session.user.id,
      screenGenerationLimiter
    );
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Too many generation requests. Please try again later.",
          retryAfter: limit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": limit.resetAt.getTime().toString(),
            "Retry-After": limit.retryAfter.toString(),
          },
        }
      );
    }

    if (!prompt || typeof prompt !== "string")
      throw new Error("Invalid prompt");

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

    if (!project) throw new Error("Project not found");

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

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.log("Error occurred", error);
    return NextResponse.json(
      {
        error: "Failed to generate project",
      },
      { status: 500 }
    );
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!themeId) throw new Error("Invalid themeId");

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

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.log("Error occurred", error);
    return NextResponse.json(
      {
        error: "Failed to update project",
      },
      { status: 500 }
    );
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    const { checkRateLimit, projectDeletionLimiter } =
      await import("@/lib/rate-limit");
    const limit = await checkRateLimit(session.user.id, projectDeletionLimiter);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Too many deletion requests. Please slow down.",
          retryAfter: limit.retryAfter,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": limit.resetAt.getTime().toString(),
            "Retry-After": limit.retryAfter.toString(),
          },
        }
      );
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

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting project:", error);
    return NextResponse.json(
      {
        error: "Failed to delete project",
      },
      { status: 500 }
    );
  }
}
