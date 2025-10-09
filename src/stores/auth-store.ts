import { create } from 'zustand';
import { LoginResponse, AuthState, LoginApiResponse } from '../types/auth';
import axiosInstance from '../lib/axios';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: { UIN: string; password: string }) => Promise<LoginResponse>;
  logout: () => void;
  clearError: () => void;
}

// Initialize state from sessionStorage
const initializeAuth = () => {
  const token = sessionStorage.getItem('token');
  const userStr = sessionStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null
      };
    } catch {
      // If parsing fails, clear invalid data
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('SchoolId');
    }
  }
  
  return {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null
  };
};

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state from sessionStorage
  ...initializeAuth(),

  // Actions
  login: async (credentials: { UIN: string; password: string }) => {
    set({ isLoading: true, error: null });
    
    try {
      // Call the real API endpoint
      const response = await axiosInstance.post<LoginApiResponse>('/Auth/login', {
        UIN: credentials.UIN,
        Password: credentials.password
      });

      const { success, message, data } = response.data;

      if (success && data) {
        const { user, token } = data;

        // Store token, user, and SchoolId in sessionStorage
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('SchoolId', user.schoolId);

        set({ 
          isAuthenticated: true, 
          user: user, 
          isLoading: false 
        });
        
        return {
          success: true,
          message,
          user: user,
          token: token
        };
      } else {
        set({ 
          error: message, 
          isLoading: false 
        });
        
        return {
          success: false,
          message
        };
      }
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle different error responses from the API
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      }

      set({ 
        error: errorMessage, 
        isLoading: false 
      });
      
      return {
        success: false,
        message: errorMessage
      };
    }
  },

  logout: () => {
    // Clear sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('SchoolId');

    set({ 
      isAuthenticated: false, 
      user: null, 
      error: null 
    });
  },

  clearError: () => {
    set({ error: null });
  }
}));
