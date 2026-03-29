"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For getting started with CanvasX.",
    badge: null,
    features: [
      "2 Projects",
      "5 Screens per project",
      "3 Themes",
      "10 AI generations/month",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$6",
    period: "/month",
    description: "For creators who need more flexibility.",
    badge: "Most popular",
    features: [
      "6 Projects",
      "10 Screens per project",
      "15 Themes",
      "100 AI generations/month",
    ],
    buttonText: "Choose Pro",
    buttonVariant: "default" as const,
    highlighted: true,
  },
  {
    name: "Unlimited",
    price: "$20",
    period: "/month",
    description: "For power users with bigger workflows.",
    badge: null,
    features: [
      "Unlimited Projects",
      "Unlimited Screens",
      "All 22 Themes",
      "Unlimited AI generations",
    ],
    buttonText: "Choose Unlimited",
    buttonVariant: "outline" as const,
  },
];

export default function PricingPage() {
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
            {pricingPlans.map((plan, i) => (
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
                  }`}
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary" className="px-3 py-1 text-xs">
                        {plan.name}
                      </Badge>
                      {plan.badge && (
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
                      variant={plan.buttonVariant}
                      className={`w-full cursor-pointer ${
                        plan.name !== "Pro"
                          ? "hover:border-primary hover:bg-primary/10 hover:text-primary"
                          : ""
                      }`}
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

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
