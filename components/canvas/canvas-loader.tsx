import { LoadingStatusType } from "@/context/canvas-context";
import { cn } from "@/lib/utils";

import { Spinner } from "../ui/spinner";

const CanvasLoader = ({
  status,
  onRetry,
}: {
  status?: LoadingStatusType | "fetching" | "finalizing";
  onRetry?: () => void;
}) => {
  const isFailed = status === "failed";
  return (
    <div
      className={cn(
        `absolute top-4 left-1/2 z-20 flex max-w-full min-w-40 -translate-x-1/2 items-center space-x-2 rounded-br-xl rounded-bl-xl px-4 pt-1.5 pb-2 shadow-md`,
        status === "fetching" && "bg-gray-500 text-white",
        status === "running" && "bg-amber-500 text-white",
        status === "analyzing" && "bg-blue-500 text-white",
        status === "generating" && "bg-purple-500 text-white",
        status === "finalizing" && "bg-purple-500 text-white",
        isFailed && "flex-col items-start gap-2 bg-red-500 py-3 text-white"
      )}
    >
      {!isFailed && (
        <>
          <Spinner className="h-4 w-4 stroke-3!" />
          <span className="text-sm font-semibold capitalize">
            {status === "fetching" ? "Loading Project" : status}
          </span>
        </>
      )}

      {isFailed && (
        <>
          <div className="flex w-full items-center space-x-2">
            <svg
              className="h-5 w-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-bold">Generation Failed</span>
          </div>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-500 shadow-sm transition-all hover:bg-red-50 active:scale-95 active:bg-red-100"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CanvasLoader;
