import { create } from 'zustand';
import axiosInstance from '../lib/axios';

export interface Payment {
  id: string;
  studentName: string;
  studentUIN: string;
  paymentType: string;
  amount: number;
  term: string;
  session: string;
  datePaid: string;
  status: string;
  transactionReference: string;
}

interface PaymentState {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  isLoading: false,
  error: null,

  fetchPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/Payment/get-payments');
      set({ payments: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message || 'Failed to fetch payments',
        isLoading: false,
      });
    }
  },
}));
