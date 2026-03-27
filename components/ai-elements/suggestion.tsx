"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";

export type SuggestionsProps = ComponentProps<typeof ScrollArea>;

export const Suggestions = ({
  className,
  children,
  ...props
}: SuggestionsProps) => (
  <ScrollArea className="w-full overflow-x-auto whitespace-nowrap" {...props}>
    <div className={cn("flex w-max flex-nowrap items-center gap-2", className)}>
      {children}
    </div>
    <ScrollBar className="hidden" orientation="horizontal" />
  </ScrollArea>
);

export type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export const Suggestion = ({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}: SuggestionProps) => {
  const handleClick = () => {
    onClick?.(suggestion);
  };

  return (
    <div>
      {/* <Button
        className={cn(
          "border-border/60 bg-card/50 hover:bg-primary/10 hover:border-primary/40 hover:text-primary cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-normal backdrop-blur-sm transition-all duration-200",
          className
        )}
        onClick={handleClick}
        size={size}
        type="button"
        variant={variant}
        {...props}
      >
        {children || suggestion}
      </Button> */}

      <Badge
        variant="outline"
        className="border-border/60 bg-card/50 hover:bg-primary/10 hover:border-primary/40 hover:text-primary cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-normal backdrop-blur-sm transition-all duration-200"
        onClick={handleClick}
      >
        {" "}
        {children || suggestion}
      </Badge>
    </div>
  );
};
