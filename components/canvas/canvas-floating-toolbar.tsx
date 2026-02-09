"use client";

import { useState } from "react";

import { CameraIcon, ChevronDown, Palette, Save, Wand2 } from "lucide-react";

import { useCanvas } from "@/context/canvas-context";
import {
  useGenerateProjectById,
  useUpdateProject,
} from "@/features/use-project-id";
import { parseThemeColors } from "@/lib/themes";
import { cn } from "@/lib/utils";

import AIPromptInput from "../common/prompt-input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";
import ThemeSelector from "./theme-selector";

const CanvasFloatingToolbar = ({
  projectId,
  isScreenshotting,
  onScreenshot,
}: {
  projectId: string;
  isScreenshotting?: boolean;
  onScreenshot?: () => void;
}) => {
  const { themes, theme: currentTheme, setTheme } = useCanvas();
  const [promptText, setPromptText] = useState<string>("");

  const { mutate, isPending } = useGenerateProjectById(projectId);

  const updateProject = useUpdateProject(projectId);

  const handleAIGenerate = () => {
    if (!promptText) return;
    mutate(promptText);
  };

  const handleUpdate = () => {
    if (!currentTheme) return;
    updateProject.mutate(currentTheme.id);
  };

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2">
      <div className="bg-background w-full max-w-2xl rounded-full border shadow-xl dark:bg-gray-950">
        <div className="flex flex-row items-center gap-2 px-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon-sm"
                className="cursor-pointer rounded-2xl bg-linear-to-r from-purple-500 to-indigo-600 px-4 text-white shadow-lg shadow-purple-200/50"
              >
                <Wand2 className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mt-1 w-80 rounded-xl! border p-2! shadow-lg">
              <AIPromptInput
                promptText={promptText}
                setPromptText={setPromptText}
                className="border-muted min-h-37.5 rounded-xl! shadow-none ring-1! ring-purple-500!"
                hideSubmitBtn={true}
              />
              <Button
                className="mt-2 w-full cursor-pointer rounded-2xl bg-linear-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-200/50"
                onClick={handleAIGenerate}
              >
                {isPending ? <Spinner /> : <>Design</>}
              </Button>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger>
              <div className="flex items-center gap-2 px-3 py-2">
                <Palette className="size-4" />
                <div className="flex gap-1.5">
                  {themes?.slice(0, 4)?.map((theme, idx) => {
                    const color = parseThemeColors(theme.style);
                    return (
                      <div
                        role="button"
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTheme(theme.id);
                        }}
                        className={cn(
                          `h-6.5 w-6.5 cursor-pointer rounded-full`,
                          currentTheme?.id === theme.id &&
                            "ring-1 ring-offset-1"
                        )}
                        style={{
                          background: `linear-gradient(135deg, ${color.primary}, ${color.accent})`,
                        }}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-1 text-sm">
                  +{themes?.length - 4} more
                  <ChevronDown className="size-4" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="rounded-xl border px-0 shadow">
              <ThemeSelector />
            </PopoverContent>
          </Popover>

          {/* Divider */}
          <Separator orientation="vertical" className="h-4!" />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              className="cursor-pointer rounded-full"
              disabled={isScreenshotting}
              onClick={onScreenshot}
            >
              {isScreenshotting ? (
                <Spinner />
              ) : (
                <CameraIcon className="size-4.5" />
              )}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="cursor-pointer rounded-full"
              onClick={handleUpdate}
            >
              {updateProject.isPending ? (
                <Spinner />
              ) : (
                <>
                  <Save className="size-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasFloatingToolbar;
