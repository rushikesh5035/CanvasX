import { Ratelimit } from "@upstash/ratelimit";

import { redis } from "./redis";

export const projectCreationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 projects per hour
  analytics: true,
  prefix: "ratelimit:project-creation",
});

export const screenGenerationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 generations per hour
  analytics: true,
  prefix: "ratelimit:screen-generation",
});

export const registrationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 registrations per hour
  analytics: true,
  prefix: "ratelimit:registration",
});

export const screenshotLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 h"), // 20 screenshots per hour
  analytics: true,
  prefix: "ratelimit:screenshot",
});

export const projectDeletionLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 deletions per hour
  analytics: true,
  prefix: "ratelimit:project-deletion",
});

// Helper Function
export async function checkRateLimit(userId: string, limiter: Ratelimit) {
  const { success, limit, reset, remaining } = await limiter.limit(userId);

  return {
    allowed: success,
    limit,
    remaining,
    resetAt: new Date(reset),
    retryAfter: success ? 0 : Math.ceil((reset - Date.now()) / 1000),
    headers: {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
    },
  };
}
