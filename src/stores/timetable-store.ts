import { create } from 'zustand';
import {
  GetTimetableByClassResponse,
  CreateMultipleTimetableEntriesDto,
  CreateTimetableForOneDayRequest,
  CreateTimeTableTypeRequest,
  UpdateTimeTableTypeRequest,
  GetTimeTableTypeResponse,
} from '../types/timetable';
import axiosInstance from '../lib/axios';

interface TimetableState {
  timetables: GetTimetableByClassResponse[];
  selectedTimetable: GetTimetableByClassResponse | null;
  timetableTypes: GetTimeTableTypeResponse[];
  selectedTimetableType: GetTimeTableTypeResponse | null;
  isLoading: boolean;
  error: string | null;

  // Timetable Actions
  fetchAllTimetables: () => Promise<void>;
  fetchTimetableByClass: (classId: string) => Promise<void>;
  fetchTimetableByStaff: (staffId: string) => Promise<void>;
  fetchTimetableBySubject: (subjectId: string) => Promise<void>;
  createTimetable: (data: CreateMultipleTimetableEntriesDto) => Promise<void>;
  createTimetableForDay: (data: CreateTimetableForOneDayRequest) => Promise<void>;
  deleteTimetableByClass: (classId: string) => Promise<void>;

  // Timetable Type Actions
  fetchTimetableTypes: () => Promise<void>;
  fetchTimetableTypeById: (id: string) => Promise<void>;
  createTimetableType: (data: CreateTimeTableTypeRequest) => Promise<void>;
  updateTimetableType: (id: string, data: UpdateTimeTableTypeRequest) => Promise<void>;
  deleteTimetableType: (id: string) => Promise<void>;

  // Utility Actions
  clearError: () => void;
  clearSelectedTimetable: () => void;
  clearSelectedTimetableType: () => void;
}

export const useTimetableStore = create<TimetableState>((set, get) => ({
  // Initial state
  timetables: [],
  selectedTimetable: null,
  timetableTypes: [],
  selectedTimetableType: null,
  isLoading: false,
  error: null,

  // Timetable Actions
  fetchAllTimetables: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/Timetable/get-all-grouped');
      set({ timetables: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch timetables',
        isLoading: false,
      });
    }
  },

  fetchTimetableByClass: async (classId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/Timetable/get-by-class?classId=${classId}`);
      set({ selectedTimetable: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch timetable',
        isLoading: false,
      });
    }
  },

  fetchTimetableByStaff: async (staffId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/Timetable/by-staff?staffId=${staffId}`);
      set({ timetables: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch staff timetable',
        isLoading: false,
      });
    }
  },

  fetchTimetableBySubject: async (subjectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/Timetable/by-subject?subjectId=${subjectId}`);
      set({ timetables: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch subject timetable',
        isLoading: false,
      });
    }
  },

  createTimetable: async (data: CreateMultipleTimetableEntriesDto) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/Timetable/create-timetable', data);
      // Refresh the list
      await get().fetchAllTimetables();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create timetable',
        isLoading: false,
      });
      throw error;
    }
  },

  createTimetableForDay: async (data: CreateTimetableForOneDayRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/Timetable/upload-day', data);
      // Refresh the list
      await get().fetchAllTimetables();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create timetable for day',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTimetableByClass: async (classId: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/Timetable/delete-timetable-by-class?classId=${classId}`);
      // Refresh the list
      await get().fetchAllTimetables();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete timetable',
        isLoading: false,
      });
      throw error;
    }
  },

  // Timetable Type Actions
  fetchTimetableTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/TimeTableType/all');
      set({ timetableTypes: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch timetable types',
        isLoading: false,
      });
    }
  },

  fetchTimetableTypeById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/TimeTableType/get?id=${id}`);
      set({ selectedTimetableType: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch timetable type',
        isLoading: false,
      });
    }
  },

  createTimetableType: async (data: CreateTimeTableTypeRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post('/TimeTableType/create', data);
      // Refresh the list
      await get().fetchTimetableTypes();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create timetable type',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTimetableType: async (id: string, data: UpdateTimeTableTypeRequest) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put('/TimeTableType/update', { ...data, id });
      // Refresh the list
      await get().fetchTimetableTypes();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update timetable type',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTimetableType: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/TimeTableType/delete?id=${id}`);
      // Refresh the list
      await get().fetchTimetableTypes();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete timetable type',
        isLoading: false,
      });
      throw error;
    }
  },

  // Utility Actions
  clearError: () => set({ error: null }),
  
  clearSelectedTimetable: () => set({ selectedTimetable: null }),
  
  clearSelectedTimetableType: () => set({ selectedTimetableType: null }),
}));
