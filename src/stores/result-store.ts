import { create } from 'zustand';
import axiosInstance from '../lib/axios';

// Types
export interface ResultResponse {
  id: string;
  studentId: string;
  studentUin: string;
  subjectCode: string;
  first_CA_Score: number;
  second_CA_Score: number;
  third_CA_Score: number;
  exam_Score: number;
  total_Score: number;
  term: number;
  session: string;
}

export interface CreateResultRequest {
  studentId: string;
  studentUin: string;
  subjectCode: string;
  first_CA_Score: number;
  second_CA_Score: number;
  third_CA_Score: number;
  exam_Score: number;
  term: number;
  session: string;
}

export interface UpdateResultRequest {
  id: string;
  first_CA_Score: number;
  second_CA_Score: number;
  third_CA_Score: number;
  exam_Score: number;
}

export interface StudentForResult {
  id: string;
  uin: string;
  fullName: string;
  className?: string;
}

export interface SubjectOption {
  id: string;
  name: string;
  code: string;
}

export interface AcademicSession {
  id: string;
  name: string;
  isCurrent: boolean;
  currentTerm?: number;
}

interface ResultState {
  results: ResultResponse[];
  studentsForResult: StudentForResult[];
  subjects: SubjectOption[];
  academicSessions: AcademicSession[];
  currentSession: AcademicSession | null;
  isLoading: boolean;
  error: string | null;
}

interface ResultStore extends ResultState {
  // Fetch actions
  fetchAllResults: () => Promise<void>;
  fetchResultsByStudent: (studentId: string) => Promise<ResultResponse[]>;
  fetchStudentsBySubject: (subjectId: string) => Promise<void>;
  fetchStudentsByClass: (className: string) => Promise<void>;
  fetchStudentList: (searchParam?: string) => Promise<void>;
  fetchSubjects: () => Promise<void>;
  fetchAcademicSessions: () => Promise<void>;
  fetchCurrentSession: () => Promise<void>;
  
  // CRUD actions
  createResult: (data: CreateResultRequest) => Promise<void>;
  updateResult: (data: UpdateResultRequest) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  
  // Utility
  clearError: () => void;
  clearStudents: () => void;
}

export const useResultStore = create<ResultStore>((set, get) => ({
  results: [],
  studentsForResult: [],
  subjects: [],
  academicSessions: [],
  currentSession: null,
  isLoading: false,
  error: null,

  fetchAllResults: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/Results');
      const data = response.data.data || response.data || [];
      set({ results: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch results';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchResultsByStudent: async (studentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/Results/student/${studentId}/${studentId}`);
      const data = response.data.data || response.data || [];
      set({ isLoading: false });
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch student results';
      set({ error: errorMessage, isLoading: false });
      return [];
    }
  },

  fetchStudentsBySubject: async (subjectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/Student/get-students-with-subject?subjectId=${subjectId}`);
      const data = response.data.data || response.data || [];
      const students: StudentForResult[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        uin: item.uin,
        fullName: item.fullName || `${item.firstName} ${item.lastName}`,
        className: item.className,
      }));
      set({ studentsForResult: students, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch students';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStudentsByClass: async (className: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/Student/get-students-with-class?className=${className}`);
      const data = response.data.data || response.data || [];
      const students: StudentForResult[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        uin: item.uin,
        fullName: item.fullName || `${item.firstName} ${item.lastName}`,
        className: item.className,
      }));
      set({ studentsForResult: students, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch students';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStudentList: async (searchParam?: string) => {
    set({ isLoading: true, error: null });
    try {
      const paramValue = searchParam || '';
      const response = await axiosInstance.get(`/Student/get-students-with-spec?param=${encodeURIComponent(paramValue)}`);
      const data = response.data.data || response.data || [];
      const students: StudentForResult[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        uin: item.uin,
        fullName: item.fullName || `${item.firstName} ${item.lastName}`,
        className: item.className,
      }));
      set({ studentsForResult: students, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch students';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSubjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/Subject/get-all-subjects');
      const data = response.data.data || response.data || [];
      const subjects: SubjectOption[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        name: item.name,
        code: item.code,
      }));
      set({ subjects, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch subjects';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchAcademicSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/AcademicSession/get-all-sessions');
      const data = response.data.data || response.data || [];
      const sessions: AcademicSession[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        name: item.name,
        isCurrent: item.isCurrent,
        currentTerm: item.currentTerm,
      }));
      set({ academicSessions: sessions, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch sessions';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchCurrentSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/AcademicSession/get-current-session');
      const data = response.data.data || response.data;
      if (data) {
        const session: AcademicSession = {
          id: data.id,
          name: data.name,
          isCurrent: data.isCurrent,
          currentTerm: data.currentTerm,
        };
        set({ currentSession: session, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch current session';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createResult: async (data: CreateResultRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/Results', data);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create result';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateResult: async (data: UpdateResultRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put('/Results', data);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update result';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  deleteResult: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/Results/${id}`);
      const { results } = get();
      set({ results: results.filter(r => r.id !== id), isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete result';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
  clearStudents: () => set({ studentsForResult: [] }),
}));
