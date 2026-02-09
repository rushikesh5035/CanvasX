import { NextResponse } from "next/server";

import { generateProjectName } from "@/app/action/action";
import { inngest } from "@/inngest/client";
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    const limit = await checkRateLimit(user.id, projectCreationLimiter);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: "Too many projects created. Please try again later.",
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

    // Verify user exists in database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      console.error("User not found in database:", userId);
      return NextResponse.json(
        { error: "User not found. Please sign in again." },
        { status: 404 }
      );
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

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);

    // Handle specific Prisma errors
    if (error instanceof Error && "code" in error) {
      const prismaError = error as { code: string };
      if (prismaError.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid user reference. Please sign in again." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create project",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json({
      success: true,
      data: project,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}
