"use client";

import { cn } from "@/lib/utils";
import {
  CodeIcon,
  DownloadIcon,
  GripVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import { ButtonGroup } from "../ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type PropsType = {
  title: string;
  isSelected?: boolean;
  disabled?: boolean;
  isDownloading: boolean;
  scale?: number;
  isRegenerating?: boolean;
  isDeleting?: boolean;
  onOpenHtmlDialog: () => void;
  onDownloadPng?: () => void;
  onRegenerate?: (prompt: string) => void;
  onDeleteFrame?: () => void;
};

const DeviceFramToolbar = ({
  title,
  isSelected,
  disabled,
  scale = 1.7,
  isDownloading,
  isRegenerating = false,
  isDeleting = false,
  onOpenHtmlDialog,
  onDownloadPng,
  onRegenerate,
  onDeleteFrame,
}: PropsType) => {
  const [promptValue, setPromptValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleRegenerate = () => {
    if (promptValue.trim()) {
      onRegenerate?.(promptValue);
      setPromptValue("");
      setIsPopoverOpen(false);
    }
  };
  return (
    <div
      className={cn(
        `absolute -mt-2 flex items-center justify-between gap-2 rounded-full z-50`,
        isSelected
          ? `left-1/2 -translate-x-1/2 border bg-card dark:bg-muted pl-2 py-1 shadown-sm min-w-65 h-8.75`
          : "w-[150px h-auto] left-10 ",
      )}
      style={{
        top: isSelected ? "-70px" : "-38px",
        transformOrigin: "center top",
        transform: `scale(${scale})`,
      }}
    >
      <div
        role="button"
        className="flex flex-1 cursor-grab items-center justify-start gap-1.5 active:cursor-grabbing h-full"
      >
        <GripVertical className="size-4 text-muted-foreground" />
        <div
          className={cn(
            `min-w-20 font-medium text-sm mx-px truncate mt-0.5`,
            isSelected && "w-[100px]",
          )}
        >
          {title}
        </div>
      </div>

      {isSelected && (
        <>
          <Separator orientation="vertical" className="h-5 bg-border" />
          <ButtonGroup className="gap-px justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={disabled}
                    size="sm"
                    variant="ghost"
                    className="rounded-full dark:hover:bg-white/20 hover:bg-muted cursor-pointer"
                    onClick={onOpenHtmlDialog}
                  >
                    <CodeIcon className="size-3.5! stroke-1.5! mt-px" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View HTML</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={disabled || isDownloading}
                    size="icon-sm"
                    className="rounded-full dark:hover:bg-white/20 hover:bg-muted cursor-pointer"
                    variant="ghost"
                    onClick={onDownloadPng}
                  >
                    {isDownloading ? (
                      <Spinner />
                    ) : (
                      <DownloadIcon className="size-3.5! stroke-1.5!" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download PNG</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </ButtonGroup>
        </>
      )}
    </div>
  );
};

export default DeviceFramToolbar;
