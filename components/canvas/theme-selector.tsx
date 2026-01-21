import { useCanvas } from "@/context/canvas-context";
import ThemeItem from "./theme-item";

const ThemeSelector = () => {
  const { themes, theme: currentTheme, setTheme } = useCanvas();
  return (
    <div className="flex flex-col max-h-96">
      <div className="flex-1 pb-2 px-3 overflow-y-auto">
        <h3 className="font-semibold text-sm mb-2">Choose a theme</h3>
        <div className="py-2 space-y-3">
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
