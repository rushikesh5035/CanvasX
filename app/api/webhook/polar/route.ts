import { Webhooks } from "@polar-sh/nextjs";

import { getPlanByProductId } from "@/constant/plans";
import prisma from "@/lib/prisma";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onSubscriptionCreated: async (payload) => {
    console.log("📦 Subscription created:", payload.data.id);

    const subscription = payload.data;

    // get customers email from polar
    const cutsomerEmail = subscription.customer?.email;
    if (!cutsomerEmail) {
      console.error("No customer email found in subscription");
      return;
    }

    // find the user in our db by email
    const user = await prisma.user.findUnique({
      where: { email: cutsomerEmail },
    });

    if (!user) {
      console.error("No user found with email:", cutsomerEmail);
      return;
    }

    // Determine which plan based on the product ID
    const productId = subscription.product?.id;
    const plan = getPlanByProductId(productId);

    if (!plan) {
      console.error("Unknown product ID:", productId);
      return;
    }

    // upsert the subscription record
    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        polarSubscriptionId: subscription.id,
        polarCustomerId: subscription.customer?.id,
        polarProductId: productId,
        planId: plan.id,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart
          ? new Date(subscription.currentPeriodStart)
          : null,
        currentPeriodEnd: subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd)
          : null,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
      },
      update: {
        polarSubscriptionId: subscription.id,
        polarCustomerId: subscription.customer?.id,
        // polarCustomerId: subscription.customer?.id || null,
        polarProductId: productId,
        planId: plan.id,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart
          ? new Date(subscription.currentPeriodStart)
          : null,
        currentPeriodEnd: subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd)
          : null,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      },
    });

    console.log(`✅ Subscription saved for user ${user.email} → ${plan.name}`);
  },

  onSubscriptionUpdated: async (payload) => {
    console.log("🔄 Subscription updated:", payload.data.id);

    const subscription = payload.data;

    // find existing subscription by polar subscription ID
    const existingSubscription = await prisma.subscription.findUnique({
      where: { polarSubscriptionId: subscription.id },
    });

    if (!existingSubscription) {
      console.error("No subscription found with ID:", subscription.id);
      return;
    }

    // Determine which plan based on the product ID
    const productId = subscription.product?.id;
    const plan = getPlanByProductId(productId);

    if (!plan) {
      console.error("Unknown product ID:", productId);
      return;
    }

    // upsert the subscription record
    await prisma.subscription.update({
      where: { polarSubscriptionId: subscription.id },
      data: {
        polarProductId: productId,
        planId: plan.id || existingSubscription.planId,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart
          ? new Date(subscription.currentPeriodStart)
          : null,
        currentPeriodEnd: subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd)
          : null,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      },
    });
    console.log(`✅ Subscription updated: ${subscription.id}`);
  },

  onSubscriptionCanceled: async (payload) => {
    console.log("❌ Subscription canceled:", payload.data.id);

    await prisma.subscription.update({
      where: { polarSubscriptionId: payload.data.id },
      data: {
        status: "canceled",
        cancelAtPeriodEnd: true,
      },
    });
    console.log(`✅ Subscription canceled: ${payload.data.id}`);
  },

  onSubscriptionRevoked: async (payload) => {
    console.log("🚫 Subscription revoked:", payload.data.id);

    await prisma.subscription.update({
      where: { polarSubscriptionId: payload.data.id },
      data: {
        status: "revoked",
      },
    });
    console.log(`✅ Subscription revoked: ${payload.data.id}`);
  },

  onOrderCreated: async (payload) => {
    console.log("📦 Order created:", payload.data.id);
  },

  onPayload: async (payload) => {
    console.log("📬 Webhook event:", payload.type);
  },
});
