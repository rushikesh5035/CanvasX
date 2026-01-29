"use server";

import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";

import { getSubscriptionToken, Realtime } from "@inngest/realtime";

export async function fetchRealtimeSubscriptionToken() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // This creates a token using the Inngest API that is bound to the channel and topic:
  const token = await getSubscriptionToken(inngest, {
    channel: `user:${session.user.id}`,
    topics: [
      "generation.start",
      "analysis.start",
      "analysis.complete",
      "frame.created",
      "generation.complete",
    ],
  });

  return token;
}
