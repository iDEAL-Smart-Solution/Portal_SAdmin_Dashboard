import { create } from 'zustand';
import { CreateResourceTypeRequest, UpdateResourceTypeRequest, GetResourceTypeResponse } from '../types/resource-type';
import axiosInstance from '../lib/axios';

interface ResourceTypeState {
  resourceTypes: GetResourceTypeResponse[];
  selectedResourceType: GetResourceTypeResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchResourceTypes: () => Promise<void>;
  fetchResourceTypeById: (id: string) => Promise<void>;
  createResourceType: (data: CreateResourceTypeRequest) => Promise<void>;
  updateResourceType: (id: string, data: UpdateResourceTypeRequest) => Promise<void>;
  deleteResourceType: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedResourceType: () => void;
}

export const useResourceTypeStore = create<ResourceTypeState>((set, get) => ({
  // Initial state
  resourceTypes: [],
  selectedResourceType: null,
  isLoading: false,
  error: null,

  // Actions
  fetchResourceTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/ResourceType/get-all');
      set({ resourceTypes: response.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch resource types', 
        isLoading: false 
      });
    }
  },

  fetchResourceTypeById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/ResourceType/get-by-id?id=${id}`);
      set({ selectedResourceType: response.data.data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch resource type', 
        isLoading: false 
      });
    }
  },

  createResourceType: async (data: CreateResourceTypeRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/ResourceType/create', data);
      // Refresh the list
      await get().fetchResourceTypes();
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create resource type', 
        isLoading: false 
      });
      throw error;
    }
  },

  updateResourceType: async (id: string, data: UpdateResourceTypeRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put('/ResourceType/update', { ...data, id });
      // Refresh the list
      await get().fetchResourceTypes();
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update resource type', 
        isLoading: false 
      });
      throw error;
    }
  },

  deleteResourceType: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/ResourceType/delete?id=${id}`);
      // Refresh the list
      await get().fetchResourceTypes();
      set({ isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete resource type', 
        isLoading: false 
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedResourceType: () => set({ selectedResourceType: null }),
}));
