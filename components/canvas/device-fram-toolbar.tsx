"use client";

import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CodeIcon,
  DownloadIcon,
  GripVertical,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";
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
        `absolute z-50 -mt-2 flex items-center justify-between gap-2 rounded-full`,
        isSelected
          ? `bg-card dark:bg-muted shadown-sm left-1/2 h-8.75 min-w-65 -translate-x-1/2 border py-1 pl-2`
          : "w-[150px h-auto] left-10"
      )}
      style={{
        top: isSelected ? "-70px" : "-38px",
        transformOrigin: "center top",
        transform: `scale(${scale})`,
      }}
    >
      <div
        role="button"
        className="flex h-full flex-1 cursor-grab items-center justify-start gap-1.5 active:cursor-grabbing"
      >
        <GripVertical className="text-muted-foreground size-4" />
        <div
          className={cn(
            `mx-px mt-0.5 min-w-20 truncate text-sm font-medium`,
            isSelected && "w-[100px]"
          )}
        >
          {title}
        </div>
      </div>

      {isSelected && (
        <>
          <Separator orientation="vertical" className="bg-border h-5" />
          <ButtonGroup className="justify-end gap-px">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={disabled}
                    size="sm"
                    variant="ghost"
                    className="hover:bg-muted cursor-pointer rounded-full dark:hover:bg-white/20"
                    onClick={onOpenHtmlDialog}
                  >
                    <CodeIcon className="stroke-1.5! mt-px size-3.5!" />
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
                    className="hover:bg-muted cursor-pointer rounded-full dark:hover:bg-white/20"
                    variant="ghost"
                    onClick={onDownloadPng}
                  >
                    {isDownloading ? (
                      <Spinner />
                    ) : (
                      <DownloadIcon className="stroke-1.5! size-3.5!" />
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
