import { create } from 'zustand';
import axiosInstance from '../lib/axios';

// Types
export interface ResultResponse {
  id: string;
  studentId: string;
  studentUin: string;
  studentName?: string;
  subjectCode: string;
  first_CA_Score: number;
  second_CA_Score: number;
  third_CA_Score: number;
  exam_Score: number;
  total_Score: number;
  term: number;
  session: string;
}

const normalizeResultRecord = (item: any): ResultResponse => {
  const firstCa = Number(item.firstCA ?? item.first_CA_Score ?? item.firstCaScore ?? 0);
  const secondCa = Number(item.secondCA ?? item.second_CA_Score ?? item.secondCaScore ?? 0);
  const thirdCa = Number(item.thirdCA ?? item.third_CA_Score ?? item.thirdCaScore ?? 0);
  const examScore = Number(item.exam ?? item.exam_Score ?? item.examScore ?? 0);
  const totalScore = Number(item.totalScore ?? item.total_Score ?? item.total ?? 0);

  return {
    id: item.id ?? item.resultId ?? '',
    studentId: item.studentId ?? item.student_id ?? '',
    studentUin: item.studentUin ?? item.studentUIN ?? item.student_uin ?? item.studentId ?? '',
    studentName: item.studentName ?? item.fullName ?? item.student_name ?? '',
    subjectCode: item.subjectCode ?? item.subject_code ?? item.subject?.code ?? '',
    first_CA_Score: firstCa,
    second_CA_Score: secondCa,
    third_CA_Score: thirdCa,
    exam_Score: examScore,
    total_Score: totalScore,
    term: Number(item.term ?? 0),
    session: item.session ?? item.academicSession ?? '',
  };
};

export interface CreateResultRequest {
  studentId: string;
  studentUin: string;
  subjectId: string;
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
  fetchSubjectsByClass: (classId: string) => Promise<void>;
  fetchAcademicSessions: () => Promise<void>;
  fetchCurrentSession: () => Promise<void>;
  
  // CRUD actions
  createResult: (data: CreateResultRequest) => Promise<void>;
  updateResult: (data: UpdateResultRequest) => Promise<void>;
  deleteResult: (id: string) => Promise<void>;
  uploadResultsExcel: (formData: FormData) => Promise<any>;
  downloadResultsExcelTemplate: () => Promise<Blob>;
  
  // Utility
  clearError: () => void;
  clearStudents: () => void;
  clearSubjects: () => void;
}

const subjectCacheByClassId = new Map<string, SubjectOption[]>();
let subjectOptionsCache: SubjectOption[] | null = null;

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
      const normalizedResults = Array.isArray(data) ? data.map(normalizeResultRecord) : [];
      set({ results: normalizedResults, isLoading: false });
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
      if (subjectOptionsCache) {
        set({ subjects: subjectOptionsCache, isLoading: false });
        return;
      }

      const response = await axiosInstance.get('/Subject/options');
      const data = response.data.data || response.data || [];
      const subjects: SubjectOption[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        name: item.name,
        code: item.code,
      }));
      subjectOptionsCache = subjects;
      set({ subjects, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch subjects';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSubjectsByClass: async (classId: string) => {
    set({ isLoading: true, error: null });
    try {
      const cachedSubjects = subjectCacheByClassId.get(classId);
      if (cachedSubjects) {
        set({ subjects: cachedSubjects, isLoading: false });
        return;
      }

      const response = await axiosInstance.get(`/Subject/by-class/${classId}`);
      const data = response.data.data || response.data || [];
      const subjects: SubjectOption[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        name: item.name,
        code: item.code,
      }));

      subjectCacheByClassId.set(classId, subjects);
      set({ subjects, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch subjects for class';
      set({ error: errorMessage, isLoading: false, subjects: [] });
    }
  },

  fetchAcademicSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/AcademicSession/get-all-sessions');
      const data = response.data.data || response.data || [];
      const sessions: AcademicSession[] = (Array.isArray(data) ? data : []).map((item: any) => ({
        id: item.id,
        name: item.current_Session || item.name || '',
        isCurrent: item.isCurrent ?? false,
        currentTerm: item.current_Term ?? item.currentTerm,
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
          name: data.current_Session || data.name || '',
          isCurrent: data.isCurrent ?? true,
          currentTerm: data.current_Term ?? data.currentTerm,
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

  uploadResultsExcel: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/Results/import-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload Excel results';
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  downloadResultsExcelTemplate: async () => {
    try {
      const response = await axiosInstance.get('/Results/excel-template', { responseType: 'blob' });
      return response.data as Blob;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to download results template';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  clearError: () => set({ error: null }),
  clearStudents: () => set({ studentsForResult: [] }),
  clearSubjects: () => set({ subjects: [] }),
}));
