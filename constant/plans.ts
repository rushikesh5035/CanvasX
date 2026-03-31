export const PLANS = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    polarProductId: null,
    limits: {
      maxProjects: 2,
      maxScreensPerProject: 5,
      maxThemes: 3,
      maxGenerationsPerMonth: 10,
    },
  },
  PRO: {
    id: "pro",
    name: "Pro",
    price: 6,
    polarProductId: process.env.POLAR_PRO_PRODUCT_ID,
    limits: {
      maxProjects: 6,
      maxScreensPerProject: 10,
      maxThemes: 15,
      maxGenerationsPerMonth: 100,
    },
  },
  UNLIMITED: {
    id: "unlimited",
    name: "Unlimited",
    price: 20,
    polarProductId: process.env.POLAR_UNLIMITED_PRODUCT_ID,
    limits: {
      maxProjects: Infinity,
      maxScreensPerProject: Infinity,
      maxThemes: Infinity,
      maxGenerationsPerMonth: Infinity,
    },
  },
} as const;

export type PlanId = keyof typeof PLANS;

// Get a plan config by its Polar product ID
export function getPlanByProductId(productId: string) {
  return Object.values(PLANS).find((plan) => plan.polarProductId === productId);
}

// Get a plan config by its plan ID
export function getPlanById(planId: string) {
  const key = planId.toUpperCase() as PlanId;
  return PLANS[key] || PLANS.FREE;
}
