"use client";

import { CornerDownLeftIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import { Spinner } from "../ui/spinner";

interface PropsType {
  promptText: string;
  setPromptText: (value: string) => void;
  isLoading?: boolean;
  className?: string;
  hideSubmitBtn?: boolean;
  onSubmit?: () => void;
}

const AIPromptInput = ({
  promptText,
  setPromptText,
  isLoading,
  className,
  hideSubmitBtn = false,
  onSubmit,
}: PropsType) => {
  return (
    <div className="bg-background">
      <InputGroup
        className={cn(
          "bg-background max-h-43 min-h-43 rounded-2xl",
          className && className
        )}
      >
        <InputGroupTextarea
          className={cn(
            "max-h-43 overflow-y-auto py-2.5! text-base!",
            "[&::-webkit-scrollbar]:w-0.75"
          )}
          placeholder="I want to design an app that..."
          value={promptText}
          onChange={(e) => {
            setPromptText(e.target.value);
          }}
        />

        <InputGroupAddon
          align="block-end"
          className="flex items-center justify-end"
        >
          {!hideSubmitBtn && (
            <InputGroupButton
              variant="default"
              className="hover:cursor-pointer"
              size="sm"
              disabled={!promptText?.trim() || isLoading}
              onClick={() => onSubmit?.()}
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <>
                  Design
                  <CornerDownLeftIcon className="size-4" />
                </>
              )}
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default AIPromptInput;
