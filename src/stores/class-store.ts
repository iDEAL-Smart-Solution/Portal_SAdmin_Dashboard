import { create } from 'zustand';
import { 
  CreateClassRequest, 
  UpdateClassRequest, 
  GetClassResponse, 
  GetAClassResponse,
  ClassApiResponse
} from '../types/class';
import axiosInstance from '../lib/axios';

interface ClassState {
  // Class list
  classList: GetClassResponse[];
  selectedClass: GetAClassResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchClassList: () => Promise<void>;
  fetchClassById: (id: string) => Promise<void>;
  createClass: (classData: CreateClassRequest) => Promise<void>;
  updateClass: (id: string, classData: UpdateClassRequest) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedClass: () => void;
}

export const useClassStore = create<ClassState>((set, get) => ({
  // Initial state
  classList: [],
  selectedClass: null,
  isLoading: false,
  error: null,

  // Actions
  fetchClassList: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/Class/get-all-classes');
      set({ classList: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch class list';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchClassById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ClassApiResponse>(`/Class/get-class-by-id?id=${id}`);
      set({ selectedClass: response.data.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch class details';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createClass: async (classData: CreateClassRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/Class/create-class', classData);
      
      // Refresh the class list after successful creation
      await get().fetchClassList();
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to create class';
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateClass: async (id: string, classData: UpdateClassRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put('/Class/update-class', classData);
      
      // Refresh the class list after successful update
      await get().fetchClassList();
      
      // If we're viewing the updated class, refresh its details
      const currentSelectedClass = get().selectedClass;
      if (currentSelectedClass && currentSelectedClass.id === id) {
        await get().fetchClassById(id);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to update class';
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteClass: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/Class/delete-class?id=${id}`);
      
      // Refresh the class list after successful deletion
      await get().fetchClassList();
      
      // Clear selected class if it was deleted
      const currentSelectedClass = get().selectedClass;
      if (currentSelectedClass && currentSelectedClass.id === id) {
        set({ selectedClass: null });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to delete class';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedClass: () => set({ selectedClass: null })
}));
