import { parseThemeColors, ThemeType } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import React from "react";

const ThemeItem = ({
  theme,
  isSelected,
  onSelect,
}: {
  theme: ThemeType;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const color = parseThemeColors(theme.style);

  return (
    <button
      onClick={onSelect}
      className={cn(
        `flex items-center justify-between w-full
        p-1 rounded-xl border gap-4 bg-background
        hover:border-primary/50 hover:bg-accent/50
        `,
        isSelected ? "border-2" : "border",
      )}
      style={{
        borderColor: isSelected ? color.primary : "",
      }}
    >
      <div className="flex gap-2">
        {["primary", "secondary", "accent", "muted"].map((key) => (
          <div
            key={key}
            className="w-4 h-4 rounded-full border"
            style={{
              backgroundColor: color[key],
              borderColor: "#ccc",
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 flex-[0.9]">
        <span className="text-sm">{theme.name}</span>
        {isSelected && <CheckIcon size={16} color={color.primary} />}
      </div>
    </button>
  );
};

export default ThemeItem;
