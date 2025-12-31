import { create } from 'zustand';
import { 
  CreateSubjectRequest, 
  UpdateSubjectRequest, 
  GetSingleSubjectResponse, 
  GetManySubjectResponse,
  StaffOption,
  ClassOption
} from '../types/subject';
import axiosInstance from '../lib/axios';

interface SubjectState {
  // Subject list
  subjectList: GetManySubjectResponse[];
  selectedSubject: GetSingleSubjectResponse | null;
  staffOptions: StaffOption[];
  classOptions: ClassOption[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchSubjectList: (schoolId?: string) => Promise<void>;
  fetchSubjectById: (id: string) => Promise<void>;
  fetchSubjectsByTeacher: (staffId: string) => Promise<void>;
  fetchSubjectsByFilter: (name?: string, code?: string, className?: string) => Promise<void>;
  fetchStaffOptions: () => Promise<void>;
  fetchClassOptions: () => Promise<void>;
  createSubject: (subjectData: CreateSubjectRequest) => Promise<void>;
  updateSubject: (id: string, subjectData: UpdateSubjectRequest) => Promise<void>;
  deleteSubject: (id: string, schoolId: string) => Promise<void>;
  clearError: () => void;
  clearSelectedSubject: () => void;
}

export const useSubjectStore = create<SubjectState>((set, get) => ({
  // Initial state
  subjectList: [],
  selectedSubject: null,
  staffOptions: [],
  classOptions: [],
  isLoading: false,
  error: null,

  // Actions
  fetchSubjectList: async (schoolId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Get schoolId from session storage if not provided
      const currentSchoolId = schoolId || sessionStorage.getItem('SchoolId');
      if (!currentSchoolId) {
        throw new Error('School ID is required to fetch subjects');
      }
      
      const response = await axiosInstance.get(`/Subject/${currentSchoolId}`);
      
      // Handle the new response format { success: true, data: [...] }
      const subjects = response.data.data || response.data;
      set({ subjectList: Array.isArray(subjects) ? subjects : [], isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.details || 
                          error.message || 
                          'Failed to fetch subject list';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSubjectById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const schoolId = sessionStorage.getItem('SchoolId');
      if (!schoolId) {
        throw new Error('School ID is required to fetch subject details');
      }
      
      const response = await axiosInstance.get(`/Subject/single/${id}/${schoolId}`);
      
      // Handle the new response format { success: true, data: {...} }
      const subjectData = response.data.data || response.data;
      const normalizedSubject: GetSingleSubjectResponse = {
        id: subjectData.id,
        name: subjectData.name,
        code: subjectData.code,
        description: subjectData.description,
        className: subjectData.className,
        staffId: subjectData.staffId,
        schoolId: subjectData.schoolId
      };
      
      set({ selectedSubject: normalizedSubject, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.details || 
                          error.message || 
                          'Failed to fetch subject details';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSubjectsByTeacher: async (staffId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/Subject/by-teacher/${staffId}`);
      
      // Handle the new response format { success: true, data: [...] }
      const subjects = response.data.data || response.data;
      set({ subjectList: Array.isArray(subjects) ? subjects : [], isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.details || 
                          error.message || 
                          'Failed to fetch subjects by teacher';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchSubjectsByFilter: async (name?: string, code?: string, className?: string) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (name) params.append('name', name);
      if (code) params.append('code', code);
      if (className) params.append('className', className);
      
      const response = await axiosInstance.get(`/Subject/filter?${params.toString()}`);
      
      // Handle the new response format { success: true, data: [...] }
      const subjects = response.data.data || response.data;
      set({ subjectList: Array.isArray(subjects) ? subjects : [], isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.details || 
                          error.message || 
                          'Failed to fetch subjects by filter';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStaffOptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/Staff/get-staffs-with-spec?param=');
      const staffOptions: StaffOption[] = response.data.map((staff: any) => ({
        id: staff.id,
        fullName: staff.fullName,
        email: staff.email
      }));
      set({ staffOptions, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch staff options';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchClassOptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/Class/get-all-classes');
      const classOptions: ClassOption[] = response.data.map((cls: any) => ({
        id: cls.id,
        name: cls.name,
        studentCount: cls.studentCount,
        subjectCount: cls.subjectCount
      }));
      set({ classOptions, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch class options';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createSubject: async (subjectData: CreateSubjectRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/Subject', subjectData);
      
      // Only refresh list and set loading false on SUCCESS
      await get().fetchSubjectList(subjectData.schoolId);
      set({ isLoading: false });
      
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data?.details || 
                          error.message || 
                          'Failed to create subject';
      set({ error: errorMessage, isLoading: false });
      
      // RE-THROW the error so the form knows it failed
      throw new Error(errorMessage);
    }
  },

  updateSubject: async (id: string, subjectData: UpdateSubjectRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put('/Subject', subjectData);
      
      // Refresh the subject list after successful update
      await get().fetchSubjectList();
      
      // If we're viewing the updated subject, refresh its details
      const currentSelectedSubject = get().selectedSubject;
      if (currentSelectedSubject && currentSelectedSubject.id === id) {
        await get().fetchSubjectById(id);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to update subject';
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteSubject: async (id: string, schoolId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const currentSchoolId = schoolId || sessionStorage.getItem('SchoolId');
      if (!currentSchoolId) {
        throw new Error('School ID is required to delete subject');
      }
      
      await axiosInstance.delete(`/Subject/${id}/${currentSchoolId}`);
      
      // Refresh the subject list after successful deletion
      await get().fetchSubjectList(currentSchoolId);
      
      // Clear selected subject if it was deleted
      const currentSelectedSubject = get().selectedSubject;
      if (currentSelectedSubject && currentSelectedSubject.id === id) {
        set({ selectedSubject: null });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to delete subject';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedSubject: () => set({ selectedSubject: null })
}));
