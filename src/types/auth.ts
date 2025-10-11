// Authentication types and interfaces

export interface LoginRequest {
  UIN: string;
  Password: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  uin: string;
  phoneNumber: string;
  gender: string;
  profilePicture: string;
  schoolId: string;
}

export interface LoginApiResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginFormData {
  UIN: string;
  password: string;
}
