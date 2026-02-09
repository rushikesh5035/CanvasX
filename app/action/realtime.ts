"use server";

import { getSubscriptionToken, Realtime } from "@inngest/realtime";

import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";

export async function fetchRealtimeSubscriptionToken() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const token = await getSubscriptionToken(inngest, {
    channel: `user:${session.user.id}`,
    topics: [
      "generation.start",
      "analysis.start",
      "analysis.complete",
      "frame.created",
      "generation.complete",
      "generation.failed",
    ],
  });

  return token;
}
