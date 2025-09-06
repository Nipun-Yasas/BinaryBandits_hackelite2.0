// Debugging utilities for authentication

export const DEBUG = process.env.NODE_ENV === "development";

export function debugLog(message: string, data?: unknown) {
  if (DEBUG) {
    console.log(`[AUTH DEBUG] ${message}`, data ? data : "");
  }
}

export function debugError(message: string, error?: unknown) {
  if (DEBUG) {
    console.error(`[AUTH ERROR] ${message}`, error ? error : "");
  }
}

export function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  
  return "An unexpected error occurred";
}

// Log authentication events for debugging
export function logAuthEvent(event: string, details?: unknown) {
  if (DEBUG) {
    console.log(`[AUTH EVENT] ${event}`, details ? details : "");
  }
}
