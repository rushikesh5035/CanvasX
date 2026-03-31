"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { Crown, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrentUser } from "@/lib/session";

interface UserPlan {
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
    currentPeriodEnd: string | null;
  } | null;
}

const planConfig = {
  free: {
    icon: Sparkles,
    className: "bg-muted/80 text-muted-foreground border-border hover:bg-muted",
  },
  pro: {
    icon: Zap,
    className:
      "bg-primary/10 text-primary border-primary/20 hover:bg-primary/15",
  },
  unlimited: {
    icon: Crown,
    className:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/15 dark:text-amber-400",
  },
};

export default function PlanBadge({ compact = false }: { compact?: boolean }) {
  const { isAuthenticated } = useCurrentUser();
  const router = useRouter();
  const [plan, setPlan] = useState<UserPlan | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/api/user/plan")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setPlan(data.data);
      })
      .catch(console.error);
  }, [isAuthenticated]);

  if (!isAuthenticated || !plan) return null;

  const config =
    planConfig[plan.planId as keyof typeof planConfig] || planConfig.free;
  const Icon = config.icon;

  const projectsUsed = plan.usage.projectCount;
  const projectsMax = plan.limits.maxProjects;
  const isUnlimited = projectsMax === null || !isFinite(projectsMax);
  const creditsText = isUnlimited
    ? `${projectsUsed} projects`
    : `${projectsUsed}/${projectsMax}`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`cursor-pointer gap-1.5 border px-2.5 py-1 text-xs font-medium transition-colors ${config.className}`}
            onClick={() => router.push("/pricing")}
          >
            <Icon className="size-3" />
            {compact ? (
              plan.name
            ) : (
              <>
                <span>{plan.name}</span>
                <span className="bg-background/50 rounded px-1 py-0.5 text-[10px] font-semibold">
                  {creditsText}
                </span>
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <div className="space-y-1">
            <p className="font-semibold">{plan.name} Plan</p>
            <p>
              Projects: {projectsUsed} / {isUnlimited ? "∞" : projectsMax}
            </p>
            <p>
              Screens/project:{" "}
              {isFinite(plan.limits.maxScreensPerProject)
                ? plan.limits.maxScreensPerProject
                : "∞"}
            </p>
            <p>
              AI generations:{" "}
              {isFinite(plan.limits.maxGenerationsPerMonth)
                ? `${plan.limits.maxGenerationsPerMonth}/mo`
                : "∞"}
            </p>
            {plan.planId === "free" && (
              <p className="text-primary mt-1 font-medium">
                Click to upgrade →
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
