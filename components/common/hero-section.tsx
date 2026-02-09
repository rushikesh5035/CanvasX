"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { promptSuggestions } from "@/data/prompts";
import { useCreateProject } from "@/features/use-project";
import { useCurrentUser } from "@/lib/session";

import { Suggestion, Suggestions } from "../ai-elements/suggestion";
import Header from "./header";
import AIPromptInput from "./prompt-input";
import RecentProjects from "./recent-projects";

const HeroSection = () => {
  const [promptText, setPromptText] = useState<string>("");
  const router = useRouter();

  const { user } = useCurrentUser();

  const { mutate, isPending } = useCreateProject();

  const handlePromptSuggestionClick = (val: string) => {
    setPromptText(val);
  };

  const handleSubmit = () => {
    if (!promptText) return;

    // Check if user is logged in
    if (!user) {
      router.push("/signin");
      return;
    }

    mutate(promptText);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex flex-col">
        <Header />

        <div className="relative overflow-hidden pt-28">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-8">
            <div className="space-y-3">
              <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
                Design mobile apps <br className="md:hidden" />
                <span className="text-primary">in minutes</span>
              </h1>
              <div className="mx-auto max-w-2xl">
                <p className="text-foreground text-center leading-relaxed font-medium sm:text-lg">
                  Go from idea to beautiful app mockups in minutes by chatting
                  with AI.
                </p>
              </div>
            </div>

            <div className="item-center relative z-10 flex w-full max-w-3xl flex-col gap-8">
              <div className="w-full">
                <AIPromptInput
                  className="ring-primary ring-2"
                  promptText={promptText}
                  setPromptText={setPromptText}
                  isLoading={isPending}
                  onSubmit={handleSubmit}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-2 px-5">
                <Suggestions>
                  {promptSuggestions.map((s) => (
                    <Suggestion
                      key={s.label}
                      suggestion={s.label}
                      className="h-7! px-2.5 pt-1! text-xs!"
                      onClick={() => handlePromptSuggestionClick(s.value)}
                    >
                      {s.icon}
                      <span>{s.label}</span>
                    </Suggestion>
                  ))}
                </Suggestions>
              </div>
            </div>

            <div className="absolute top-[80%] left-1/2 -z-10 h-750 w-1250 -translate-x-1/2">
              <div className="bg-radial-primary absolute bottom-[calc(100%-300px)] left-1/2 h-500 w-500 -translate-x-1/2 opacity-20"></div>
              <div className="bg-primary/20 absolute -mt-2.5 size-full rounded-[50%] opacity-70 [box-shadow:0_-15px_24.8px_var(--primary)]"></div>
              <div className="bg-background absolute z-0 size-full rounded-[50%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Project Section */}
      <RecentProjects />
    </div>
  );
};

export default HeroSection;
