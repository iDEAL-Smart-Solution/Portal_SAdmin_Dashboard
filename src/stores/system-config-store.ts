import { create } from 'zustand';
import axiosInstance from '../lib/axios';

export interface SystemConfiguration {
  id: string;
  key: string;
  value: string;
  description: string;
}

export interface CreateSystemConfigRequest {
  key: string;
  value: string;
  description: string;
}

export interface UpdateSystemConfigRequest {
  id: string;
  key: string;
  value: string;
  description: string;
}

interface SystemConfigState {
  configurations: SystemConfiguration[];
  isLoading: boolean;
  error: string | null;
  fetchConfigurations: () => Promise<void>;
  createConfiguration: (data: CreateSystemConfigRequest) => Promise<void>;
  updateConfiguration: (data: UpdateSystemConfigRequest) => Promise<void>;
  deleteConfiguration: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useSystemConfigStore = create<SystemConfigState>((set) => ({
  configurations: [],
  isLoading: false,
  error: null,

  fetchConfigurations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/SystemConfigurations/get-all');
      const data = Array.isArray(response.data) ? response.data : [];
      set({ configurations: data, isLoading: false });
    } catch (error: any) {
      console.error('Fetch configurations error:', error.response || error);
      set({
        error: error.response?.data?.message || error.response?.data?.details || error.message || 'Failed to fetch configurations',
        isLoading: false,
      });
    }
  },

  createConfiguration: async (data: CreateSystemConfigRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/SystemConfigurations/create', data);
      const response = await axiosInstance.get('/SystemConfigurations/get-all');
      set({ configurations: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to create configuration',
        isLoading: false,
      });
      throw error;
    }
  },

  updateConfiguration: async (data: UpdateSystemConfigRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put('/SystemConfigurations/update', data);
      const response = await axiosInstance.get('/SystemConfigurations/get-all');
      set({ configurations: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to update configuration',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteConfiguration: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/SystemConfigurations/delete?id=${id}`);
      const response = await axiosInstance.get('/SystemConfigurations/get-all');
      set({ configurations: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to delete configuration',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
