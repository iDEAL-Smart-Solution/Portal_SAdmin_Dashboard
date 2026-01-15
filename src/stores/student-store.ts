import { create } from 'zustand';
import { 
  CreateStudentRequest, 
  UpdateStudentRequest, 
  GetSingleStudentResponse, 
  GetManyStudentResponse,
  ClassOption,
  StudentApiResponse
} from '../types/student';
import axiosInstance from '../lib/axios';

interface StudentState {
  // Student list
  studentList: GetManyStudentResponse[];
  selectedStudent: GetSingleStudentResponse | null;
  classOptions: ClassOption[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStudentList: (searchParam?: string) => Promise<void>;
  fetchStudentById: (id: string) => Promise<void>;
  fetchStudentByUIN: (uin: string) => Promise<void>;
  fetchStudentsByClass: (className: string) => Promise<void>;
  fetchStudentsBySubject: (subjectId: string) => Promise<void>;
  fetchClassOptions: () => Promise<void>;
  createStudent: (studentData: CreateStudentRequest) => Promise<void>;
  updateStudent: (id: string, studentData: UpdateStudentRequest) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedStudent: () => void;
}


export const useStudentStore = create<StudentState>((set, get) => ({
  // Initial state
  studentList: [],
  selectedStudent: null,
  classOptions: [],
  isLoading: false,
  error: null,

  // Actions
  fetchStudentList: async (searchParam?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Always send a param, even if empty string, so backend can handle it properly
      const paramValue = searchParam || '';
      const response = await axiosInstance.get(`/Student/get-students-with-spec?param=${encodeURIComponent(paramValue)}`);
      set({ studentList: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch student list';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStudentById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<StudentApiResponse>(`/Student/get-student-with-id?id=${id}`);
      const studentData = response.data.data;
      
      // Normalize the response to match our interface
      const normalizedStudent: GetSingleStudentResponse = {
        id: studentData.id,
        fullName: studentData.fullName,
        firstName: studentData.fullName.split(' ')[0], // Extract from fullName
        lastName: studentData.fullName.split(' ').slice(1).join(' '), // Extract from fullName
        middleName: '', // Default empty since not in API response
        dateOfBirth: studentData.dateOfBirth,
        email: studentData.email,
        phoneNumber: studentData.phoneNumber || studentData.phonenumber,
        className: studentData.className,
        classId: '', // Default empty since not in API response
        address: studentData.address,
        gender: studentData.gender,
        uin: studentData.uin,
        profilePicture: '', // Default empty since not in API response
        createdAt: new Date().toISOString(), // Default current time
        updatedAt: new Date().toISOString() // Default current time
      };
      
      set({ selectedStudent: normalizedStudent, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch student details';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStudentByUIN: async (uin: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<StudentApiResponse>(`/Student/get-student-with-uin?uin=${uin}`);
      const studentData = response.data.data;
      
      // Normalize the response to match our interface
      const normalizedStudent: GetSingleStudentResponse = {
        id: studentData.id,
        fullName: studentData.fullName,
        firstName: studentData.fullName.split(' ')[0], // Extract from fullName
        lastName: studentData.fullName.split(' ').slice(1).join(' '), // Extract from fullName
        middleName: '', // Default empty since not in API response
        dateOfBirth: studentData.dateOfBirth,
        email: studentData.email,
        phoneNumber: studentData.phoneNumber || studentData.phonenumber,
        className: studentData.className,
        classId: '', // Default empty since not in API response
        address: studentData.address,
        gender: studentData.gender,
        uin: studentData.uin,
        profilePicture: '', // Default empty since not in API response
        createdAt: new Date().toISOString(), // Default current time
        updatedAt: new Date().toISOString() // Default current time
      };
      
      set({ selectedStudent: normalizedStudent, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch student details';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStudentsByClass: async (className: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/Student/get-students-with-class?className=${className}`);
      set({ studentList: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch students by class';
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchStudentsBySubject: async (subjectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/Student/get-students-with-subject?subjectId=${subjectId}`);
      set({ studentList: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to fetch students by subject';
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

  createStudent: async (studentData: CreateStudentRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('firstName', studentData.firstName);
      formData.append('lastName', studentData.lastName);
      formData.append('middleName', studentData.middleName);
      formData.append('dateOfBirth', studentData.dateOfBirth.toISOString());
      formData.append('email', studentData.email);
      formData.append('phoneNumber', studentData.phoneNumber);
      formData.append('classId', studentData.classId);
      formData.append('address', studentData.address);
      formData.append('password', studentData.password);
      formData.append('gender', studentData.gender);
      formData.append('profilePicture', studentData.profilePicture);
      formData.append('birthCertificate', studentData.birthCertificate);
      formData.append('previousResulturl', studentData.previousResulturl);

      await axiosInstance.post('/Student/create-student', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh the student list after successful creation
      await get().fetchStudentList();
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to create student';
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateStudent: async (_id: string, _studentData: UpdateStudentRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Note: Update endpoint not available in backend yet
      // This is a placeholder implementation
      throw new Error('Update student functionality not available yet');
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to update student';
      set({ error: errorMessage, isLoading: false });
    }
  },

  deleteStudent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/Student/delete-student?id=${id}`);
      
      // Refresh the student list after successful deletion
      await get().fetchStudentList();
    } catch (error: any) {
      const errorMessage = error.response?.data?.details || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to delete student';
      set({ error: errorMessage, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedStudent: () => set({ selectedStudent: null })
}));
