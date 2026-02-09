import { useCanvas } from "@/context/canvas-context";

import ThemeItem from "./theme-item";

const ThemeSelector = () => {
  const { themes, theme: currentTheme, setTheme } = useCanvas();
  return (
    <div className="flex max-h-96 flex-col">
      <div className="flex-1 overflow-y-auto px-3 pb-2">
        <h3 className="mb-2 text-sm font-semibold">Choose a theme</h3>
        <div className="space-y-3 py-2">
          {themes?.map((theme) => (
            <ThemeItem
              key={theme.id}
              theme={theme}
              isSelected={currentTheme?.id === theme.id}
              onSelect={() => setTheme(theme.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
