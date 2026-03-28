import { NextResponse } from "next/server";

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface Apisuccess<T = unknown> {
  success: true;
  data: T;
  cached?: boolean;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

export type ApiResponse<T = unknown> = Apisuccess<T> | ApiErrorResponse;

// error codes for API responses
export const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
} as const;

// Success response helper
export function successResponse<T>(
  data: T,
  options?: { cached?: boolean }
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    ...(options?.cached && { cached: true }),
  });
}

// Error response helper
export function errorResponse(
  error: ApiError,
  status: number,
  headers?: HeadersInit
): NextResponse<ApiErrorResponse> {
  const sanitizedError =
    process.env.NODE_ENV === "production" && error.details
      ? { ...error, details: undefined }
      : error;

  return NextResponse.json(
    {
      success: false,
      error: sanitizedError,
    },
    { status, headers }
  );
}

// Specific error response helpers
export function unauthorizedResponse(
  message: string = "Unauthorized",
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    { code: ErrorCodes.UNAUTHORIZED, message, details },
    401
  );
}

export function forbiddenResponse(
  message: string = "Access denied"
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    {
      code: ErrorCodes.FORBIDDEN,
      message,
    },
    403
  );
}

export function notFoundResponse(
  resource: string = "Resource"
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    {
      code: ErrorCodes.NOT_FOUND,
      message: `${resource} not found`,
    },
    404
  );
}

export function validationErrorResponse(
  message: string,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    {
      code: ErrorCodes.VALIDATION_ERROR,
      message,
      details,
    },
    400
  );
}

export function rateLimitResponse(
  retryAfter: number,
  limit: number,
  resetAt: Date
): NextResponse<ApiErrorResponse> {
  return errorResponse(
    {
      code: ErrorCodes.RATE_LIMIT_EXCEEDED,
      message: "Too many requests. Please try again later.",
      details: { retryAfter },
    },
    429,
    {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": resetAt.getTime().toString(),
      "Retry-After": retryAfter.toString(),
    }
  );
}

export function internalErrorResponse(
  message: string = "An internal error occurred",
  details?: unknown
): NextResponse<ApiErrorResponse> {
  if (details) console.error("Internal Error:", details);

  return errorResponse(
    {
      code: ErrorCodes.INTERNAL_ERROR,
      message,
      details: process.env.NODE_ENV === "development" ? details : undefined,
    },
    500
  );
}

export function databaseErrorResponse(
  operation: string,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  console.error(`Database error during ${operation}:`, details);

  return errorResponse(
    {
      code: ErrorCodes.DATABASE_ERROR,
      message: `Database operation failed: ${operation}`,
      details: process.env.NODE_ENV === "development" ? details : undefined,
    },
    500
  );
}

export function handlePrismaError(
  error: unknown,
  operation: string
): NextResponse<ApiErrorResponse> {
  if (error && typeof error === "object" && "code" in error) {
    const prismaError = error as { code: string; meta?: unknown };

    switch (prismaError.code) {
      case "P2002":
        return validationErrorResponse(
          "A record with this value already exists",
          prismaError.meta
        );
      case "P2003":
        return validationErrorResponse(
          "Invalid reference to related record",
          prismaError.meta
        );
      case "P2025":
        return notFoundResponse("Record");
      default:
        return databaseErrorResponse(operation, error);
    }
  }

  return internalErrorResponse(`Failed to ${operation}`, error);
}
