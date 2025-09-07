// API client utilities for authentication

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  ok?: boolean;
  error?: string;
  data?: T;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: "user" | "admin";
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
    throw new ApiError(
      response.status,
      response.statusText,
      errorData.error || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return response.json();
}

export async function login(data: LoginData): Promise<ApiResponse> {
  try {
    const result = await apiRequest<ApiResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "Network error. Please try again." };
  }
}

export async function signup(data: SignupData): Promise<ApiResponse> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return { ok: false, error: json.error || "Signup failed" };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "Network error" };
  }
}

export async function logout(): Promise<ApiResponse> {
  try {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      return { ok: false, error: j.error || "Logout failed" };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: "Network error logging out" };
  }
}

// Adjust getCurrentUser to ensure cookies sent
export async function getCurrentUser(): Promise<User | null> {
  const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
  if (!res.ok) return null;
  const json = await res.json();
  return json.user ?? null;
}


