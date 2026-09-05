import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import {
  PendingSubmissionDto,
  SubmissionDetailDto,
  ApproveSubmissionRequest,
  RejectResultRequest
} from '../types/result-approval';

interface ResultApprovalState {
  submissions: PendingSubmissionDto[];
  activeSubmission: SubmissionDetailDto | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isActionLoading: boolean;
  error: string | null;
}

interface ResultApprovalStore extends ResultApprovalState {
  fetchSubmissions: () => Promise<void>;
  fetchSubmissionDetail: (subjectId: string, term: number, session: string) => Promise<SubmissionDetailDto | null>;
  approveEntireSubmission: (payload: ApproveSubmissionRequest) => Promise<boolean>;
  rejectIndividualResult: (resultId: string, payload: RejectResultRequest) => Promise<boolean>;
  clearActiveSubmission: () => void;
  clearError: () => void;
}

export const useResultApprovalStore = create<ResultApprovalStore>((set, get) => ({
  submissions: [],
  activeSubmission: null,
  isLoading: false,
  isDetailLoading: false,
  isActionLoading: false,
  error: null,

  fetchSubmissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/result-approval/pending-submissions');
      const rawData = response.data?.data || response.data || [];
      const submissions: PendingSubmissionDto[] = Array.isArray(rawData) ? rawData : [];
      set({ submissions, isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch pending submissions';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSubmissionDetail: async (subjectId: string, term: number, session: string) => {
    set({ isDetailLoading: true, error: null });
    try {
      const encodedSession = encodeURIComponent(session);
      const response = await axiosInstance.get(`/result-approval/submissions/${subjectId}/${term}?session=${encodedSession}`);
      const rawData = response.data?.data || response.data;

      if (rawData) {
        const detail: SubmissionDetailDto = {
          subjectId: rawData.subjectId || subjectId,
          subjectName: rawData.subjectName || '',
          subjectCode: rawData.subjectCode || '',
          className: rawData.className || '',
          term: rawData.term ?? term,
          session: rawData.session || session,
          submittedBy: rawData.submittedBy || rawData.submittedByTeacherName || 'Subject Teacher',
          submittedAt: rawData.submittedAt || rawData.submissionDate || '',
          results: Array.isArray(rawData.results) ? rawData.results : [],
        };
        set({ activeSubmission: detail, isDetailLoading: false });
        return detail;
      }
      set({ isDetailLoading: false });
      return null;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch submission details';
      set({ error: errorMessage, isDetailLoading: false });
      return null;
    }
  },

  approveEntireSubmission: async (payload: ApproveSubmissionRequest) => {
    set({ isActionLoading: true, error: null });
    try {
      await axiosInstance.post('/result-approval/approve', payload);
      
      // Update local active submission if open
      const currentActive = get().activeSubmission;
      if (currentActive && currentActive.subjectId === payload.subjectId && currentActive.term === payload.term) {
        const updatedResults = currentActive.results.map(r => ({
          ...r,
          status: 'Approved',
        }));
        set({
          activeSubmission: {
            ...currentActive,
            results: updatedResults,
          },
        });
      }

      // Refresh submissions list
      await get().fetchSubmissions();
      set({ isActionLoading: false });
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.message ||
        error.message ||
        'Failed to approve submission';
      set({ error: errorMessage, isActionLoading: false });
      return false;
    }
  },

  rejectIndividualResult: async (resultId: string, payload: RejectResultRequest) => {
    set({ isActionLoading: true, error: null });
    try {
      await axiosInstance.post(`/result-approval/${resultId}/reject`, payload);

      // Update local active submission if open
      const currentActive = get().activeSubmission;
      if (currentActive) {
        const updatedResults = currentActive.results.map(r => {
          if (r.resultId === resultId) {
            return {
              ...r,
              status: 'Rejected',
              rejectionReason: payload.reason,
            };
          }
          return r;
        });

        set({
          activeSubmission: {
            ...currentActive,
            results: updatedResults,
          },
        });
      }

      // Refresh submissions list to update counts
      await get().fetchSubmissions();
      set({ isActionLoading: false });
      return true;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.message ||
        error.message ||
        'Failed to reject student result';
      set({ error: errorMessage, isActionLoading: false });
      return false;
    }
  },

  clearActiveSubmission: () => set({ activeSubmission: null }),
  clearError: () => set({ error: null }),
}));
