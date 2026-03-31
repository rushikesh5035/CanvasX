import { NextRequest, NextResponse } from "next/server";

import { CustomerPortal } from "@polar-sh/nextjs";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const portalHandler = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox",
  getCustomerId: async (req) => {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Look up the Polar customer ID from our subscription table
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription?.polarCustomerId) {
      throw new Error("NO_SUBSCRIPTION");
    }

    return subscription.polarCustomerId;
  },
});

export async function GET(req: NextRequest) {
  try {
    return await portalHandler(req);
  } catch (error: unknown) {
    // If user has no subscription, redirect to pricing page
    if (error instanceof Error && error.message === "NO_SUBSCRIPTION") {
      return NextResponse.redirect(
        new URL("/pricing", process.env.NEXT_PUBLIC_APP_URL || req.url)
      );
    }
    // For other errors (unauthorized, etc.)
    return NextResponse.redirect(
      new URL("/signin", process.env.NEXT_PUBLIC_APP_URL || req.url)
    );
  }
}
