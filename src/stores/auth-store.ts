import { create } from 'zustand';
import { LoginRequest, LoginResponse, AuthState } from '../types/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  clearError: () => void;
}

// Mock credentials
const MOCK_CREDENTIALS = {
  UIN: 'DEV/iDL/0001',
  password: 'passer'
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,

  // Actions
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate credentials
      if (credentials.UIN === MOCK_CREDENTIALS.UIN && credentials.password === MOCK_CREDENTIALS.password) {
        const user = {
          UIN: credentials.UIN,
          name: 'System Administrator',
          role: 'admin'
        };
        
        set({ 
          isAuthenticated: true, 
          user, 
          isLoading: false 
        });
        
        return {
          success: true,
          message: 'Login successful',
          user
        };
      } else {
        const errorMessage = 'Invalid UIN or password';
        set({ 
          error: errorMessage, 
          isLoading: false 
        });
        
        return {
          success: false,
          message: errorMessage
        };
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
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
