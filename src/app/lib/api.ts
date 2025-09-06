// API client utilities for authentication

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
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
    const result = await apiRequest<ApiResponse>("/api/auth/signup", {
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

export async function logout(): Promise<ApiResponse> {
  try {
    const result = await apiRequest<ApiResponse>("/api/auth/logout", {
      method: "POST",
    });
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "Network error. Please try again." };
  }
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const result = await apiRequest<ApiResponse<User>>("/api/auth/me");
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "Network error. Please try again." };
  }
}
