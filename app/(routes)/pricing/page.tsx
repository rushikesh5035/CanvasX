"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowRight, Check, Crown, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { redirectToCheckout, redirectToPortal } from "@/app/action/checkout";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { pricingPlans } from "@/constant/pricingPlans";
import { useCurrentUser } from "@/lib/session";

interface UserPlan {
  planId: string;
  name: string;
  isActive: boolean;
  subscription: {
    status: string;
    cancelAtPeriodEnd: boolean;
    currentPeriodEnd: string | null;
  } | null;
}

// Plan for determining upgrade vs downgrade
const PLAN_ORDER = ["free", "pro", "unlimited"];

export default function PricingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useCurrentUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<UserPlan | null>(null);

  // Fetch the user's current plan
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/api/user/plan")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setCurrentPlan(data.data);
      })
      .catch(console.error);
  }, [isAuthenticated]);

  const getButtonConfig = (plan: (typeof pricingPlans)[0]) => {
    if (!isAuthenticated || !currentPlan) {
      return {
        text: plan.polarProductId ? `Choose ${plan.name}` : "Get Started",
        action: "checkout" as const,
      };
    }

    const currentIndex = PLAN_ORDER.indexOf(currentPlan.planId);
    const targetIndex = PLAN_ORDER.indexOf(plan.id);

    if (plan.id === currentPlan.planId && currentPlan.isActive) {
      return { text: "Current Plan", action: "none" as const };
    }

    if (targetIndex > currentIndex) {
      // Free users have no subscription to change — use checkout
      if (!currentPlan.subscription) {
        return { text: `Upgrade to ${plan.name}`, action: "checkout" as const };
      }
      return { text: `Upgrade to ${plan.name}`, action: "change" as const };
    }

    if (targetIndex < currentIndex) {
      if (!plan.polarProductId) {
        return { text: "Manage Subscription", action: "portal" as const };
      }
      return { text: `Downgrade to ${plan.name}`, action: "change" as const };
    }

    return { text: `Choose ${plan.name}`, action: "checkout" as const };
  };

  const handlePlanClick = async (plan: (typeof pricingPlans)[0]) => {
    const config = getButtonConfig(plan);

    if (config.action === "none") return;

    if (config.action === "portal") {
      await redirectToPortal();
      return;
    }

    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    setLoadingPlan(plan.name);

    try {
      if (config.action === "change" && plan.polarProductId) {
        // Upgrade/downgrade via API
        const res = await fetch("/api/subscription/change-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: plan.polarProductId }),
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to change plan");
          setLoadingPlan(null);
          return;
        }

        toast.success(`Plan changed to ${plan.name}! 🎉`);
        // Refresh plan data
        const planRes = await fetch("/api/user/plan");
        const planData = await planRes.json();
        if (planData.data) setCurrentPlan(planData.data);
        setLoadingPlan(null);
      } else {
        // New checkout via server action
        await redirectToCheckout(plan.polarProductId!);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoadingPlan(null);
    }
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen items-start justify-center pt-4">
        <div className="w-full max-w-6xl space-y-6 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 space-y-3 text-center sm:mb-10"
          >
            <h1 className="text-card-foreground text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Simple, transparent <span className="text-primary">pricing</span>
            </h1>
            <p className="text-muted-foreground mx-auto max-w-xl text-sm sm:text-base md:text-lg">
              Choose the plan that fits your workflow. Upgrade or downgrade
              anytime.
            </p>
          </motion.div>
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {pricingPlans.map((plan, i) => {
              const btnConfig = getButtonConfig(plan);
              const isCurrent =
                currentPlan?.planId === plan.id && currentPlan?.isActive;

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="h-full"
                >
                  <Card
                    className={`relative flex h-full flex-col ${
                      plan.highlighted
                        ? "border-primary ring-primary/10 shadow-lg ring-1"
                        : ""
                    } ${isCurrent ? "border-green-500 ring-1 ring-green-500/10" : ""}`}
                  >
                    {isCurrent && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-green-600 text-white hover:bg-green-600">
                          <Crown className="mr-1 h-3 w-3" />
                          Your Plan
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <Badge
                          variant="secondary"
                          className="px-3 py-1 text-xs"
                        >
                          {plan.name}
                        </Badge>
                        {plan.badge && !isCurrent && (
                          <Badge className="px-3 py-1 text-xs">
                            {plan.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-foreground text-4xl font-bold">
                            {plan.price}
                          </span>
                          <span className="text-muted-foreground text-lg">
                            {plan.period}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-center text-sm">
                        {plan.description}
                      </p>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature) => (
                          <li
                            key={feature}
                            className="text-foreground flex items-start gap-3 text-sm"
                          >
                            <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={isCurrent ? "outline" : plan.buttonVariant}
                        className={`w-full cursor-pointer ${
                          isCurrent
                            ? "border-green-500 text-green-600 hover:bg-green-50"
                            : plan.name !== "Pro"
                              ? "hover:border-primary hover:bg-primary/10 hover:text-primary"
                              : ""
                        }`}
                        size="lg"
                        disabled={
                          loadingPlan === plan.name ||
                          btnConfig.action === "none"
                        }
                        onClick={() => handlePlanClick(plan)}
                      >
                        {loadingPlan === plan.name ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            {btnConfig.text}
                            {btnConfig.action === "change" && (
                              <ArrowRight className="ml-1 h-4 w-4" />
                            )}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {currentPlan?.subscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <Button
                variant="link"
                className="text-muted-foreground text-sm"
                onClick={() => redirectToPortal()}
              >
                Manage your subscription →
              </Button>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: pricingPlans.length * 0.1 }}
            className="text-muted-foreground text-center text-sm"
          >
            All plans include access to our core features and customer support.
          </motion.p>
        </div>
      </div>
      <Footer />
    </>
  );
}
