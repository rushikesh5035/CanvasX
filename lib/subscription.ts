import { PlanId, PLANS } from "@/constant/plans";

import prisma from "./prisma";

export interface UserPlan {
  planId: string;
  name: string;
  isActive: boolean;
  limits: {
    maxProjects: number;
    maxScreensPerProject: number;
    maxThemes: number;
    maxGenerationsPerMonth: number;
  };
  usage: {
    projectCount: number;
  };
  subscription: {
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: Date | null;
  } | null;
}
export async function getUserPlan(userId: string): Promise<UserPlan> {
  const [subscription, projectCount] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.project.count({ where: { userId } }),
  ]);

  // no subscription or non-active → free plan
  if (!subscription || !["active", "canceled"].includes(subscription.status)) {
    return {
      planId: "free",
      name: "Free",
      isActive: true,
      limits: PLANS.FREE.limits,
      usage: { projectCount },
      subscription: null,
    };
  }

  // canceled but still within period -> still active
  const isStillActive =
    subscription.status === "active" ||
    (subscription.status === "canceled" &&
      subscription.currentPeriodEnd &&
      new Date() < subscription.currentPeriodEnd);

  const planKey = subscription.planId.toUpperCase() as PlanId;
  const plan = PLANS[planKey] || PLANS.FREE;

  return {
    planId: subscription.planId,
    name: plan.name,
    isActive: !!isStillActive,
    limits: isStillActive ? plan.limits : PLANS.FREE.limits,
    usage: { projectCount },
    subscription: {
      status: subscription.status,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
      currentPeriodEnd: subscription.currentPeriodEnd,
    },
  };
}

// check if user can create more projects.
export async function canCreateProject(userId: string): Promise<boolean> {
  const userPlan = await getUserPlan(userId);
  const projectCount = await prisma.project.count({ where: { userId } });
  return projectCount < userPlan.limits.maxProjects;
}

// Check if a user can generate more screens in a project.
export async function canGenerateScreen(
  userId: string,
  projectId: string
): Promise<boolean> {
  const userPlan = await getUserPlan(userId);
  const frameCount = await prisma.frame.count({ where: { projectId } });
  return frameCount < userPlan.limits.maxScreensPerProject;
}
