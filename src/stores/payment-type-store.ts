import { create } from 'zustand';
import axiosInstance from '../lib/axios';

export interface PaymentType {
  id: string;
  name: string;
  description: string;
  amount: number;
  classId?: string;
}

export interface CreatePaymentTypeRequest {
  name: string;
  description: string;
  amount: number;
  classId?: string;
}

export interface UpdatePaymentTypeRequest {
  id: string;
  name: string;
  description: string;
  amount: number;
  classId?: string;
}

interface PaymentTypeState {
  paymentTypes: PaymentType[];
  isLoading: boolean;
  error: string | null;
  fetchPaymentTypes: () => Promise<void>;
  createPaymentType: (data: CreatePaymentTypeRequest) => Promise<void>;
  updatePaymentType: (data: UpdatePaymentTypeRequest) => Promise<void>;
  deletePaymentType: (id: string) => Promise<void>;
  clearError: () => void;
}

export const usePaymentTypeStore = create<PaymentTypeState>((set) => ({
  paymentTypes: [],
  isLoading: false,
  error: null,

  fetchPaymentTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/PaymentType/all');
      set({ paymentTypes: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch payment types',
        isLoading: false,
      });
    }
  },

  createPaymentType: async (data: CreatePaymentTypeRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/PaymentType/create', data);
      // Refresh the list
      const response = await axiosInstance.get('/PaymentType/all');
      set({ paymentTypes: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to create payment type',
        isLoading: false,
      });
      throw error;
    }
  },

  updatePaymentType: async (data: UpdatePaymentTypeRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put('/PaymentType/update', data);
      // Refresh the list
      const response = await axiosInstance.get('/PaymentType/all');
      set({ paymentTypes: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to update payment type',
        isLoading: false,
      });
      throw error;
    }
  },

  deletePaymentType: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/PaymentType/delete?id=${id}`);
      // Refresh the list
      const response = await axiosInstance.get('/PaymentType/all');
      set({ paymentTypes: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to delete payment type',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
