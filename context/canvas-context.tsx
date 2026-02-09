"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useInngestSubscription } from "@inngest/realtime/hooks";

import { fetchRealtimeSubscriptionToken } from "@/app/action/realtime";
import { THEME_LIST, ThemeType } from "@/lib/themes";
import { FrameType } from "@/types/project";

export type LoadingStatusType =
  | "idle"
  | "running"
  | "analyzing"
  | "generating"
  | "completed"
  | "failed";

export interface CanvasContextType {
  theme?: ThemeType;
  setTheme: (id: string) => void;
  themes: ThemeType[];

  frames: FrameType[];
  setFrames: (frames: FrameType[]) => void;
  updateFrame: (id: string, data: Partial<FrameType>) => void;
  addFrame: (frame: FrameType) => void;

  selectedFrameId: string | null;
  selectedFrame: FrameType | null;
  setSelectedFrameId: (id: string | null) => void;

  loadingStatus: LoadingStatusType;
  errorMessage: string | undefined;
  retryGeneration?: () => void;
}

export interface ScreenData {
  id: string;
  name: string;
  purpose?: string;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export const CanvasProvider = ({
  children,
  initialFrames,
  initialThemeId,
  hasInitialData,
  projectId,
}: {
  children: React.ReactNode;
  initialFrames: FrameType[];
  initialThemeId?: string;
  hasInitialData: boolean;
  projectId: string | null;
}) => {
  const [themeId, setThemeId] = useState<string>(
    initialThemeId || THEME_LIST[0].id
  );

  const [frames, setFrames] = useState<FrameType[]>(initialFrames || []);

  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  const [loadingStatus, setLoadingStatus] = useState<LoadingStatusType>(
    hasInitialData ? "idle" : "running"
  );

  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only update if projectId actually changed
    if (projectId === null) return;

    // Clear any existing timeout
    if (statusTimeoutRef.current) {
      clearTimeout(statusTimeoutRef.current);
      statusTimeoutRef.current = null;
    }

    setFrames(initialFrames || []);
    setThemeId(initialThemeId || THEME_LIST[0].id);
    setSelectedFrameId(null);
    // Reset loading state when switching projects
    setLoadingStatus(
      initialFrames && initialFrames.length > 0 ? "idle" : "running"
    );
    setErrorMessage(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const theme = THEME_LIST.find((theme) => theme.id === themeId);

  const selectedFrame =
    selectedFrameId && frames.length !== 0
      ? frames.find((f) => f.id === selectedFrameId) || null
      : null;

  const { freshData } = useInngestSubscription({
    refreshToken: fetchRealtimeSubscriptionToken,
  });

  useEffect(() => {
    if (!freshData || freshData.length === 0) return;

    freshData.forEach((message) => {
      const { data, topic } = message;

      if (data.projectId !== projectId) return;

      switch (topic) {
        case "generation.start":
          setLoadingStatus("running");
          setErrorMessage(undefined);

          if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
          statusTimeoutRef.current = setTimeout(() => {
            setLoadingStatus("failed");
            setErrorMessage("Generation timed out. Please try again.");
            setFrames((prev) => prev.filter((f) => !f.isLoading));
          }, 300000); // 5 minutes timeout
          break;

        case "analysis.start":
          setLoadingStatus("analyzing");
          break;

        case "analysis.complete":
          setLoadingStatus("generating");
          if (data.theme) setThemeId(data.theme);

          if (data.screens && data.screens.length > 0) {
            const skeletonFrames: FrameType[] = data.screens.map(
              (s: ScreenData) => ({
                id: s.id,
                title: s.name,
                htmlContent: "",
                isLoading: true,
              })
            );
            setFrames((prev) => [...prev, ...skeletonFrames]);
          }
          break;

        case "frame.created":
          if (data.frame) {
            setFrames((prev) => {
              const newFrame = [...prev];
              const idx = newFrame.findIndex((f) => f.id === data.screenId);
              if (idx !== -1) newFrame[idx] = data.frame;
              else newFrame.push(data.frame);
              return newFrame;
            });
          }
          break;

        case "generation.complete":
          if (statusTimeoutRef.current) {
            clearTimeout(statusTimeoutRef.current);
            statusTimeoutRef.current = null;
          }
          setLoadingStatus("completed");
          setErrorMessage(undefined);

          setTimeout(() => {
            setLoadingStatus("idle");
          }, 1000);
          break;

        case "generation.failed":
          if (statusTimeoutRef.current) {
            clearTimeout(statusTimeoutRef.current);
            statusTimeoutRef.current = null;
          }
          setLoadingStatus("failed");
          setErrorMessage(data.error || "Generation failed. Please try again.");
          setFrames((prev) => prev.filter((f) => !f.isLoading));
          break;

        default:
          break;
      }
    });
  }, [projectId, freshData]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hasInitialData && frames && frames.length > 0) {
      const clearTimer = setTimeout(() => {
        setLoadingStatus((current) => {
          if (current === "running" || current === "analyzing") {
            return "idle";
          }
          return current;
        });
      }, 3000);

      return () => clearTimeout(clearTimer);
    }
  }, [hasInitialData, frames]);

  const addFrame = useCallback((frame: FrameType) => {
    setFrames((prev) => [...prev, frame]);
  }, []);

  const updateFrame = useCallback((id: string, data: Partial<FrameType>) => {
    setFrames((prev) => {
      return prev.map((frame) =>
        frame.id === id ? { ...frame, ...data } : frame
      );
    });
  }, []);

  const retryGeneration = useCallback(() => {
    // Clear error state
    setLoadingStatus("idle");
    setErrorMessage(undefined);

    // Redirect to home page to start a new generation
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        theme,
        setTheme: setThemeId,
        themes: THEME_LIST,
        frames,
        setFrames,
        selectedFrameId,
        selectedFrame,
        setSelectedFrameId,
        updateFrame,
        addFrame,
        loadingStatus,
        errorMessage,
        retryGeneration,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error("useCanvas must be used inside CanvasProvider");
  return ctx;
};
