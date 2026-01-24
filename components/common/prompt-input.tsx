"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "../ui/input-group";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { CornerDownLeftIcon } from "lucide-react";

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
          "min-h-43 max-h-43 rounded-2xl bg-background",
          className && className,
        )}
      >
        <InputGroupTextarea
          className={cn(
            "text-base! py-2.5! max-h-43 overflow-y-auto",
            "[&::-webkit-scrollbar]:w-0.75",
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
              className=""
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
