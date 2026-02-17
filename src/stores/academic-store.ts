import { create } from 'zustand';
import { 
  UpdateAcademicSessionRequest, 
  UpdateTermRequest,
  UpdateAcademicSessionDatesRequest,
  GetAcademicSessionResponse,
  AcademicSessionApiResponse,
  BrandingFormData,
  UpdateBrandingRequest,
  convertNumberToTerm,
  convertTermToNumber
} from '../types/academic';
import axiosInstance from '../lib/axios';

interface AcademicState {
  // Single academic session
  currentSession: GetAcademicSessionResponse | null;
  currentBranding: BrandingFormData;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCurrentSession: () => Promise<void>;
  updateAcademicSession: (sessionData: UpdateAcademicSessionRequest) => Promise<void>;
  updateSessionDates: (datesData: UpdateAcademicSessionDatesRequest) => Promise<{ success: boolean; message: string }>;
  updateCurrentTerm: (termData: UpdateTermRequest) => Promise<void>;
  updateBranding: (brandingData: UpdateBrandingRequest) => Promise<void>;
  migrateToNextSession: () => Promise<void>;
  moveToNextTerm: () => Promise<void>;
  getAllSessions: () => Promise<GetAcademicSessionResponse[]>;
  getSessionById: (id: string) => Promise<GetAcademicSessionResponse>;
  deleteSession: (id: string) => Promise<void>;
  clearError: () => void;
}

// Default branding data
const defaultBranding: BrandingFormData = {
  SchoolName: 'iDEAL School Management System',
  SchoolLogoFilePath: '/src/assets/logo.jpg'
};

export const useAcademicStore = create<AcademicState>((set, get) => ({
  // Initial state
  currentSession: null,
  currentBranding: defaultBranding,
  isLoading: false,
  error: null,

  // Actions
  fetchCurrentSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<AcademicSessionApiResponse>('/AcademicSession/get-current-session');
      const apiResponse = response.data;
      
      // Extract the data from the API response structure
      const { data: sessionData } = apiResponse;
      
      // Convert backend response to frontend format
      const normalizedSession: GetAcademicSessionResponse = {
        Id: sessionData.id,
        Current_Session: sessionData.current_Session,
        Current_Term: convertNumberToTerm(sessionData.current_Term),
        SchoolName: sessionData.schoolName,
        SchoolLogoFilePath: sessionData.schoolLogoFilePath || undefined,
        NextTermBeginsOn: sessionData.nextTermBeginsOn || undefined,
        CurrentTermEndsOn: sessionData.currentTermEndsOn || undefined,
        IsActive: true, // Default to true since this is the current session
        CreatedAt: new Date().toISOString(), // Backend doesn't provide this
        UpdatedAt: new Date().toISOString()  // Backend doesn't provide this
      };
      
      // Update branding if school info is available
      if (sessionData.schoolName) {
        const updatedBranding: BrandingFormData = {
          SchoolName: sessionData.schoolName,
          SchoolLogoFilePath: sessionData.schoolLogoFilePath || get().currentBranding.SchoolLogoFilePath
        };

      set({ 
          currentSession: normalizedSession, 
          currentBranding: updatedBranding,
          isLoading: false 
        });
      } else {
        set({ 
          currentSession: normalizedSession, 
        isLoading: false 
      });
      }
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to fetch current session';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },


  updateAcademicSession: async (sessionData: UpdateAcademicSessionRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Convert frontend format to backend format
      const backendRequest = {
        Id: sessionData.Id,
        Current_Session: sessionData.Current_Session,
        Current_Term: convertTermToNumber(sessionData.Current_Term),
        NextTermBeginsOn: sessionData.NextTermBeginsOn,
        CurrentTermEndsOn: sessionData.CurrentTermEndsOn
      };
      
      await axiosInstance.put('/AcademicSession/update-session', backendRequest);
      
      // Refresh current session after update
      await get().fetchCurrentSession();
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to update academic session';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  updateSessionDates: async (datesData: UpdateAcademicSessionDatesRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put('/AcademicSession/update-session-dates', datesData);
      
      // Refresh current session after update
      await get().fetchCurrentSession();
      
      set({ isLoading: false });
      return { success: true, message: response.data.message || 'Dates updated successfully' };
    } catch (error: any) {
      let errorMessage = 'Failed to update session dates';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ 
        error: errorMessage,
        isLoading: false 
      });
      return { success: false, message: errorMessage };
    }
  },

  updateCurrentTerm: async (termData: UpdateTermRequest) => {
    set({ isLoading: true, error: null });
    try {
      // For term updates, we need to update the current session
      const currentSession = get().currentSession;
      if (!currentSession) {
        throw new Error('No current session found');
      }

      // Convert frontend format to backend format
      const backendRequest = {
        Id: currentSession.Id,
        Current_Session: currentSession.Current_Session,
        Current_Term: convertTermToNumber(termData.Current_Term)
      };

      await axiosInstance.put('/AcademicSession/update-session', backendRequest);
      
      // Refresh current session after update
      await get().fetchCurrentSession();
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to update current term';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  updateBranding: async (brandingData: UpdateBrandingRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Update current branding in local state
      const updatedBranding: BrandingFormData = {
        SchoolName: brandingData.SchoolName,
        SchoolLogoFilePath: typeof brandingData.SchoolLogoFilePath === 'string' 
          ? brandingData.SchoolLogoFilePath 
          : get().currentBranding.SchoolLogoFilePath
      };

      set({ 
        currentBranding: updatedBranding,
        isLoading: false 
      });

      // Note: Branding updates might need a separate endpoint in the backend
      // For now, we'll update the local state and the session will reflect this
      // when it's next fetched or updated
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update branding';
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  migrateToNextSession: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/AcademicSession/next-session');
      
      // Refresh current session after migration
      await get().fetchCurrentSession();
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to migrate to next session';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  moveToNextTerm: async () => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/AcademicSession/next-term');
      
      // Refresh current session after term change
      await get().fetchCurrentSession();
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to move to next term';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  getAllSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/AcademicSession/get-all-sessions');
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to fetch all sessions';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      throw error;
    }
  },

  getSessionById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/AcademicSession/get-session-by-id?id=${id}`);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to fetch session';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
      throw error;
    }
  },

  deleteSession: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/AcademicSession/delete-session?id=${id}`);
      
      // Refresh current session after deletion
      await get().fetchCurrentSession();
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to delete session';
      
      if (error.response?.data?.details) {
        errorMessage = error.response.data.details;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null })
}));
