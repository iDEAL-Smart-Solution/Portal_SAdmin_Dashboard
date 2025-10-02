import { create } from 'zustand';
import { 
  CreateAcademicSessionRequest, 
  UpdateAcademicSessionRequest, 
  UpdateTermRequest,
  GetAcademicSessionResponse,
  AcademicSessionFormData,
  BrandingFormData,
  UpdateBrandingRequest,
  Term
} from '../types/academic';

interface AcademicState {
  // Single academic session
  currentSession: GetAcademicSessionResponse | null;
  currentBranding: BrandingFormData;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCurrentSession: () => Promise<void>;
  createAcademicSession: (sessionData: CreateAcademicSessionRequest) => Promise<void>;
  updateAcademicSession: (sessionData: UpdateAcademicSessionRequest) => Promise<void>;
  updateCurrentTerm: (termData: UpdateTermRequest) => Promise<void>;
  updateBranding: (brandingData: UpdateBrandingRequest) => Promise<void>;
  clearError: () => void;
}

// Mock data for development - Single academic session
let mockCurrentSession: GetAcademicSessionResponse = {
  Id: '1',
  Current_Session: '2024/2025',
  Current_Term: Term.First,
  SchoolName: 'iDEAL School Management System',
  SchoolLogoFilePath: '/src/assets/logo.jpg',
  IsActive: true,
  CreatedAt: '2024-01-15T10:30:00Z',
  UpdatedAt: '2024-01-15T10:30:00Z'
};

const mockCurrentBranding: BrandingFormData = {
  SchoolName: 'iDEAL School Management System',
  SchoolLogoFilePath: '/src/assets/logo.jpg'
};

export const useAcademicStore = create<AcademicState>((set, get) => ({
  // Initial state
  currentSession: null,
  currentBranding: mockCurrentBranding,
  isLoading: false,
  error: null,

  // Actions
  fetchCurrentSession: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ currentSession: mockCurrentSession, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch current session',
        isLoading: false 
      });
    }
  },

  createAcademicSession: async (sessionData: CreateAcademicSessionRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create new session (replaces existing one)
      const newSession: GetAcademicSessionResponse = {
        Id: '1',
        Current_Session: sessionData.Current_Session,
        Current_Term: sessionData.Current_Term,
        SchoolName: get().currentBranding.SchoolName,
        SchoolLogoFilePath: get().currentBranding.SchoolLogoFilePath,
        IsActive: true,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      };

      // Update mock data
      mockCurrentSession = newSession;

      set({ 
        currentSession: newSession, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create academic session',
        isLoading: false 
      });
    }
  },

  updateAcademicSession: async (sessionData: UpdateAcademicSessionRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update current session
      const updatedSession: GetAcademicSessionResponse = {
        ...mockCurrentSession,
        Current_Session: sessionData.Current_Session,
        Current_Term: sessionData.Current_Term,
        UpdatedAt: new Date().toISOString()
      };

      mockCurrentSession = updatedSession;

      set({ 
        currentSession: updatedSession,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update academic session',
        isLoading: false 
      });
    }
  },

  updateCurrentTerm: async (termData: UpdateTermRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Update current term only
      const updatedSession: GetAcademicSessionResponse = {
        ...mockCurrentSession,
        Current_Term: termData.Current_Term,
        UpdatedAt: new Date().toISOString()
      };

      mockCurrentSession = updatedSession;

      set({ 
        currentSession: updatedSession,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update current term',
        isLoading: false 
      });
    }
  },

  updateBranding: async (brandingData: UpdateBrandingRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update current session branding
      const updatedSession: GetAcademicSessionResponse = {
        ...mockCurrentSession,
        SchoolName: brandingData.SchoolName,
        SchoolLogoFilePath: typeof brandingData.SchoolLogoFilePath === 'string' 
          ? brandingData.SchoolLogoFilePath 
          : mockCurrentSession.SchoolLogoFilePath,
        UpdatedAt: new Date().toISOString()
      };

      // Update current branding
      const updatedBranding: BrandingFormData = {
        SchoolName: brandingData.SchoolName,
        SchoolLogoFilePath: typeof brandingData.SchoolLogoFilePath === 'string' 
          ? brandingData.SchoolLogoFilePath 
          : get().currentBranding.SchoolLogoFilePath
      };

      mockCurrentSession = updatedSession;

      set({ 
        currentSession: updatedSession,
        currentBranding: updatedBranding,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update branding',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null })
}));
