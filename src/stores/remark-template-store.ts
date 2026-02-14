import { create } from 'zustand';
import axiosInstance from '../lib/axios';

// Types
export interface RemarkTemplateResponse {
  id: string;
  minPercentage: number;
  maxPercentage: number;
  remarkText: string;
}

export interface CreateRemarkTemplateRequest {
  minPercentage: number;
  maxPercentage: number;
  remarkText: string;
}

export interface UpdateRemarkTemplateRequest {
  id: string;
  minPercentage: number;
  maxPercentage: number;
  remarkText: string;
}

interface RemarkTemplateState {
  templates: RemarkTemplateResponse[];
  isLoading: boolean;
  error: string | null;
}

interface RemarkTemplateStore extends RemarkTemplateState {
  fetchTemplates: () => Promise<void>;
  createTemplate: (data: CreateRemarkTemplateRequest) => Promise<void>;
  updateTemplate: (data: UpdateRemarkTemplateRequest) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useRemarkTemplateStore = create<RemarkTemplateStore>((set, get) => ({
  templates: [],
  isLoading: false,
  error: null,

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/RemarkTemplates');
      const data = response.data.data || response.data || [];
      set({ templates: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Failed to fetch remark templates', isLoading: false });
    }
  },

  createTemplate: async (data: CreateRemarkTemplateRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/RemarkTemplates', data);
      set({ isLoading: false });
      // Refresh list
      await get().fetchTemplates();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create remark template';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateTemplate: async (data: UpdateRemarkTemplateRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put('/RemarkTemplates', data);
      set({ isLoading: false });
      await get().fetchTemplates();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update remark template';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  deleteTemplate: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/RemarkTemplates/${id}`);
      const { templates } = get();
      set({ templates: templates.filter(t => t.id !== id), isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete remark template';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
}));
