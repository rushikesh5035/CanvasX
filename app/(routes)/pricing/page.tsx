"use client";

import { Check } from "lucide-react";

import Header from "@/components/common/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for small projects and individuals.",
    badge: null,
    features: [
      "2 Projects",
      "5 Screens per project",
      "3 Themes",
      "10 AI generations/month",
    ],
    buttonText: "Choose Free",
    buttonVariant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$6",
    period: "/month",
    description: "Best for growing projects with more needs.",
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
    description: "Ideal for professionals that need maximum flexibility.",
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
      <div className="flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-6xl space-y-8 p-8">
          {/* Header Section */}
          <div className="space-y-3 text-center">
            <h1 className="text-primary text-sm font-medium tracking-wider uppercase">
              Pricing
            </h1>
            <h2 className="text-foreground text-3xl font-bold sm:text-4xl">
              Select the plan that best suits your needs.
            </h2>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.highlighted
                    ? "border-primary ring-primary/10 shadow-lg ring-1"
                    : ""
                }`}
              >
                <CardHeader className="space-y-4">
                  {/* Plan Name with Badge */}
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="px-3 py-1 text-xs">
                      {plan.name}
                    </Badge>
                    {plan.badge && (
                      <Badge className="px-3 py-1 text-xs">{plan.badge}</Badge>
                    )}
                  </div>

                  {/* Price */}
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

                  {/* Description */}
                  <p className="text-muted-foreground text-center text-sm">
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between space-y-6">
                  {/* Features List */}
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

                  {/* CTA Button */}
                  <Button
                    variant={plan.buttonVariant}
                    className="w-full"
                    size="lg"
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Note */}
          <p className="text-muted-foreground text-center text-sm">
            All plans include access to our core features and customer support.
          </p>
        </div>
      </div>
    </>
  );
}
