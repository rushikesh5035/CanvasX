import { AxiosError } from "axios";
import { toast } from "sonner";

interface RateLimitError {
  error: string;
  retryAfter?: number;
}

export function handleRateLimitError(
  error: unknown,
  fallbackMessage = "An error occurred"
): boolean {
  // Handle Axios errors
  if (error instanceof AxiosError && error.response?.status === 429) {
    const data = error.response.data as RateLimitError;
    const retryAfter = data?.retryAfter;
    const minutes = retryAfter ? Math.ceil(retryAfter / 60) : 60;

    toast.error(
      data?.error ||
        `Rate limit exceeded. Please try again in ${minutes} minutes.`,
      { duration: 5000 }
    );
    return true;
  }

  // Handle fetch Response errors
  if (error && typeof error === "object" && "status" in error) {
    const response = error as Response;
    if (response.status === 429) {
      toast.error(fallbackMessage, { duration: 5000 });
      return true;
    }
  }

  return false;
}

/**
 * Handles rate limit errors with specific messages for different endpoints
 */
export const rateLimitHandlers = {
  projectCreation: (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 429) {
      const retryAfter = (error.response.data as RateLimitError)?.retryAfter;
      const minutes = retryAfter ? Math.ceil(retryAfter / 60) : 60;
      toast.error(
        `Rate limit exceeded. You can create 5 projects per hour. Try again in ${minutes} minutes.`,
        { duration: 5000 }
      );
      return true;
    }
    return false;
  },

  screenGeneration: (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 429) {
      const retryAfter = (error.response.data as RateLimitError)?.retryAfter;
      const minutes = retryAfter ? Math.ceil(retryAfter / 60) : 60;
      toast.error(
        `Rate limit exceeded. You can generate 10 screens per hour. Try again in ${minutes} minutes.`,
        { duration: 5000 }
      );
      return true;
    }
    return false;
  },

  projectDeletion: (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 429) {
      const retryAfter = (error.response.data as RateLimitError)?.retryAfter;
      const minutes = retryAfter ? Math.ceil(retryAfter / 60) : 60;
      toast.error(
        `Rate limit exceeded. Please slow down. Try again in ${minutes} minutes.`,
        { duration: 5000 }
      );
      return true;
    }
    return false;
  },

  screenshot: (error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 429) {
      const retryAfter = (error.response.data as RateLimitError)?.retryAfter;
      const minutes = retryAfter ? Math.ceil(retryAfter / 60) : 60;
      toast.error(
        `Rate limit exceeded. You can take 20 screenshots per hour. Try again in ${minutes} minutes.`,
        { duration: 5000 }
      );
      return true;
    }
    return false;
  },

  registration: (error: unknown, setError?: (msg: string) => void) => {
    if (error instanceof AxiosError && error.response?.status === 429) {
      const retryAfter = (error.response.data as RateLimitError)?.retryAfter;
      const minutes = retryAfter ? Math.ceil(retryAfter / 60) : 60;
      const message = `Too many registration attempts. You can register 3 accounts per hour. Please try again in ${minutes} minutes.`;

      if (setError) {
        setError(message);
      } else {
        toast.error(message, { duration: 5000 });
      }
      return true;
    }
    return false;
  },
};

/**
 * Get error message from various error types
 */
export function getErrorMessage(
  error: unknown,
  fallback = "An error occurred"
): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.error || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
}
