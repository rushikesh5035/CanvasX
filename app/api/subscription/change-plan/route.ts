import { NextRequest } from "next/server";

import { getPlanByProductId } from "@/constant/plans";
import {
  errorResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { polar } from "@/lib/polar";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return unauthorizedResponse();
    }

    const { productId } = await req.json();
    if (!productId) {
      return validationErrorResponse("Product ID is required");
    }

    // Verify the product exists in our plans
    const plan = getPlanByProductId(productId);
    if (!plan) {
      return validationErrorResponse("Invalid product ID");
    }

    // Get the user's current subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    if (!subscription || subscription.status !== "active") {
      return validationErrorResponse(
        "No active subscription found. Please subscribe first."
      );
    }

    // Don't allow "changing" to the same plan
    if (subscription.polarProductId === productId) {
      return validationErrorResponse("You are already on this plan.");
    }

    // Use Polar SDK to update the subscription's product
    await polar.subscriptions.update({
      id: subscription.polarSubscriptionId,
      subscriptionUpdate: {
        productId: productId,
      },
    });

    return successResponse({
      message: "Plan change initiated. You will be updated shortly.",
    });
  } catch (error) {
    console.error("Error changing plan:", error);
    return errorResponse(
      {
        code: "PLAN_CHANGE_ERROR",
        message: "Failed to change plan. Please try again.",
      },
      500
    );
  }
}
