import { create } from 'zustand';
import { LoginResponse, AuthState, LoginApiResponse } from '../types/auth';
import axiosInstance from '../lib/axios';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: { UIN: string; password: string }) => Promise<LoginResponse>;
  logout: () => void;
  clearError: () => void;
  isAdmin: () => boolean;
}

// Initialize state from sessionStorage
const initializeAuth = () => {
  const token = sessionStorage.getItem('token');
  const userStr = sessionStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      
      // Check if user role is Admin
      if (user.role !== 'Admin') {
        // Clear invalid data for non-Admin users
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('SchoolId');
        
        return {
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Access denied. Only School Admin accounts can access this dashboard. Please login with an appropriate School Admin account.'
        };
      }
      
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

        // Check if user role is Admin
        if (user.role !== 'Admin') {
          set({ 
            error: 'Access denied. Only School Admin accounts can access this dashboard. Please login with an appropriate School Admin account.',
            isLoading: false 
          });
          
          return {
            success: false,
            message: 'Access denied. Only School Admin accounts can access this dashboard. Please login with an appropriate School Admin account.'
          };
        }

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
        const responseData = error.response.data;
        
        // Priority order: details > message > fallback
        // This matches the backend error structure where details contains the specific error
        if (responseData?.details) {
          // Use the details field as the primary error message (most specific)
          // Example: { message: "An unexpected error occurred.", details: "Incorrect UIN" }
          errorMessage = responseData.details;
        } else if (responseData?.message) {
          // Fallback to message field if details is not available
          errorMessage = responseData.message;
        } else if (responseData) {
          // If response data exists but no specific fields, use the data itself
          errorMessage = typeof responseData === 'string' ? responseData : JSON.stringify(responseData);
        }
      } else if (error.request) {
        // Network error - server unreachable
        errorMessage = 'Unable to connect to the server. Please check your connection.';
      } else if (error.message) {
        // Handle cases where error has a message property (like our custom axios interceptor errors)
        errorMessage = error.message;
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
  },

  isAdmin: () => {
    const { user } = useAuthStore.getState();
    return user?.role === 'Admin';
  }
}));
