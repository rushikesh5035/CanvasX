"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { motion } from "motion/react";

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
    <div className="relative min-h-screen w-full">
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />

        {/* Hero */}
        <div className="flex flex-1 items-start justify-center pt-16 pb-8 sm:pt-20 md:pt-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-6 px-4 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="space-y-5 sm:space-y-6"
            >
              <div className="mb-6 flex items-center justify-center gap-2">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="bg-primary/60 h-0.5 rounded-full"
                />
                <span className="text-primary text-xs font-semibold tracking-[0.25em] uppercase sm:text-sm">
                  AI-Powered Design
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: 40 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="bg-primary/60 h-0.5 rounded-full"
                />
              </div>
              <h1 className="text-card-foreground text-center text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-[3.4rem] md:leading-[1.15]">
                Turn your ideas into <br className="hidden sm:block" />
                <span className="relative inline-block">
                  <span className="text-primary">stunning app designs</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                    className="bg-primary/40 absolute -bottom-1 left-0 h-0.75 w-full origin-left rounded-full"
                  />
                </span>
              </h1>
              <p className="text-muted-foreground mx-auto max-w-lg text-center text-sm leading-relaxed sm:max-w-xl sm:text-base md:text-lg">
                Just describe what you want — our AI generates beautiful,
                production-ready mobile app screens in seconds. No design skills
                needed.
              </p>
            </motion.div>

            <div className="item-center relative z-10 flex w-full max-w-3xl flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="relative z-10 flex w-full max-w-3xl flex-col gap-6 sm:gap-8"
              >
                <AIPromptInput
                  promptText={promptText}
                  setPromptText={setPromptText}
                  isLoading={isPending}
                  onSubmit={handleSubmit}
                />
                <div className="flex flex-wrap justify-center px-1">
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
              </motion.div>
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <RecentProjects />
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
