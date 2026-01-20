import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative rounded-md h-9 w-9 hover:cursor-pointer"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        <SunIcon
          className={cn(
            "absolute h-5 w-5 transition",
            isDark ? "scale-100" : "scale-0",
          )}
        />
        <MoonIcon
          className={cn(
            "absolute h-5 w-5 transition",
            isDark ? "scale-0" : "scale-100",
          )}
        />
      </Button>
    </>
  );
};

export default ThemeSwitcher;
