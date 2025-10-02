// Authentication types and interfaces

export interface LoginRequest {
  UIN: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    UIN: string;
    name?: string;
    role?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    UIN: string;
    name?: string;
    role?: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormData {
  UIN: string;
  password: string;
}
