import { create } from 'zustand';
import { 
  CreateStaffRequest, 
  UpdateStaffRequest, 
  GetSingleStaffResponse, 
  GetManyStaffResponse,
  StaffFormData,
  StaffApiResponse
} from '../types/staff';
import axiosInstance from '../lib/axios';

interface StaffState {
  // Staff list
  staffList: GetManyStaffResponse[];
  selectedStaff: GetSingleStaffResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStaffList: (searchParam?: string) => Promise<void>;
  fetchStaffById: (id: string) => Promise<void>;
  createStaff: (staffData: CreateStaffRequest) => Promise<void>;
  updateStaff: (id: string, staffData: UpdateStaffRequest) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedStaff: () => void;
}


export const useStaffStore = create<StaffState>((set, get) => ({
  // Initial state
  staffList: [],
  selectedStaff: null,
  isLoading: false,
  error: null,

  // Actions
  fetchStaffList: async (searchParam?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Use search parameter if provided, otherwise get all staff
      const endpoint = searchParam 
        ? `/Staff/get-staffs-with-spec?param=${encodeURIComponent(searchParam)}`
        : '/Staff/get-staffs-with-spec?param='; // Empty param to get all
      
      const response = await axiosInstance.get<GetManyStaffResponse[]>(endpoint);
      set({ staffList: response.data, isLoading: false });
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to fetch staff list';
      
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

  fetchStaffById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<StaffApiResponse>(`/Staff/get-staff-with-id?id=${id}`);
      
      // Handle nested response structure from backend
      const apiResponse = response.data;
      
      // Normalize the data from backend format to frontend format
      const staffData: GetSingleStaffResponse = {
        id: apiResponse.data.id,
        fullName: apiResponse.data.fullName,
        email: apiResponse.data.email,
        phoneNumber: apiResponse.data.phoneNumber,
        address: apiResponse.data.address,
        gender: apiResponse.data.gender,
        UIN: apiResponse.data.uin, // Convert lowercase to uppercase for consistency
        profilePicture: apiResponse.data.profilePicture,
        subjectCodes: apiResponse.data.subjectCodes
      };
      
      set({ selectedStaff: staffData, isLoading: false });
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to fetch staff details';
      
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

  createStaff: async (staffData: CreateStaffRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('firstName', staffData.firstName);
      formData.append('lastName', staffData.lastName);
      formData.append('email', staffData.email);
      formData.append('phoneNumber', staffData.phoneNumber);
      formData.append('schoolId', staffData.schoolId);
      formData.append('address', staffData.address);
      formData.append('password', staffData.password);
      formData.append('gender', staffData.gender);
      formData.append('userName', staffData.userName);
      formData.append('profilePicture', staffData.profilePicture);

      await axiosInstance.post('/Staff/create-staff', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh staff list after creation
      await get().fetchStaffList();
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to create staff member';
      
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

  updateStaff: async (id: string, staffData: UpdateStaffRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Note: Backend doesn't have update endpoint, so we'll handle this gracefully
      // For now, we'll show an error indicating update is not supported
      throw new Error('Update staff functionality is not available in the backend API');
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to update staff member';
      
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

  deleteStaff: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/Staff/delete-staff?id=${id}`);
      
      // Refresh staff list after deletion
      await get().fetchStaffList();
    } catch (error: any) {
      // Handle API error responses with details field
      let errorMessage = 'Failed to delete staff member';
      
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

  clearError: () => set({ error: null }),
  clearSelectedStaff: () => set({ selectedStaff: null })
}));
