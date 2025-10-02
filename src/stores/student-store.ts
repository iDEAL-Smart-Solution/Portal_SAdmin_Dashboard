import { create } from 'zustand';
import { 
  CreateStudentRequest, 
  UpdateStudentRequest, 
  GetSingleStudentResponse, 
  GetManyStudentResponse,
  StudentFormData,
  ClassOption
} from '../types/student';

interface StudentState {
  // Student list
  studentList: GetManyStudentResponse[];
  selectedStudent: GetSingleStudentResponse | null;
  classOptions: ClassOption[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStudentList: () => Promise<void>;
  fetchStudentById: (id: string) => Promise<void>;
  fetchClassOptions: () => Promise<void>;
  createStudent: (studentData: CreateStudentRequest) => Promise<void>;
  updateStudent: (id: string, studentData: UpdateStudentRequest) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedStudent: () => void;
}

// Mock class options
const mockClassOptions: ClassOption[] = [
  { id: 'class-1', name: 'Grade 9A', grade: '9', section: 'A' },
  { id: 'class-2', name: 'Grade 9B', grade: '9', section: 'B' },
  { id: 'class-3', name: 'Grade 10A', grade: '10', section: 'A' },
  { id: 'class-4', name: 'Grade 10B', grade: '10', section: 'B' },
  { id: 'class-5', name: 'Grade 11A', grade: '11', section: 'A' },
  { id: 'class-6', name: 'Grade 11B', grade: '11', section: 'B' },
  { id: 'class-7', name: 'Grade 12A', grade: '12', section: 'A' },
  { id: 'class-8', name: 'Grade 12B', grade: '12', section: 'B' }
];

// Mock data for development
const mockStudentList: GetManyStudentResponse[] = [
  {
    id: '1',
    fullName: 'Emma Johnson',
    email: 'emma.johnson@idealschool.edu',
    className: 'Grade 10A',
    gender: 'female',
    UIN: 'STU001',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    classId: 'class-3',
    dateOfBirth: '2008-03-15',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    fullName: 'Michael Chen',
    email: 'michael.chen@idealschool.edu',
    className: 'Grade 11B',
    gender: 'male',
    UIN: 'STU002',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    classId: 'class-6',
    dateOfBirth: '2007-07-22',
    createdAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    fullName: 'Sarah Williams',
    email: 'sarah.williams@idealschool.edu',
    className: 'Grade 9A',
    gender: 'female',
    UIN: 'STU003',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    classId: 'class-1',
    dateOfBirth: '2009-11-08',
    createdAt: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    fullName: 'David Rodriguez',
    email: 'david.rodriguez@idealschool.edu',
    className: 'Grade 12A',
    gender: 'male',
    UIN: 'STU004',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    classId: 'class-7',
    dateOfBirth: '2006-05-12',
    createdAt: '2024-01-18T11:45:00Z'
  },
  {
    id: '5',
    fullName: 'Olivia Brown',
    email: 'olivia.brown@idealschool.edu',
    className: 'Grade 10B',
    gender: 'female',
    UIN: 'STU005',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    classId: 'class-4',
    dateOfBirth: '2008-09-30',
    createdAt: '2024-01-19T16:30:00Z'
  },
  {
    id: '6',
    fullName: 'James Wilson',
    email: 'james.wilson@idealschool.edu',
    className: 'Grade 11A',
    gender: 'male',
    UIN: 'STU006',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    classId: 'class-5',
    dateOfBirth: '2007-01-18',
    createdAt: '2024-01-20T08:15:00Z'
  },
  {
    id: '7',
    fullName: 'Sophia Davis',
    email: 'sophia.davis@idealschool.edu',
    className: 'Grade 9B',
    gender: 'female',
    UIN: 'STU007',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    classId: 'class-2',
    dateOfBirth: '2009-04-25',
    createdAt: '2024-01-21T13:20:00Z'
  },
  {
    id: '8',
    fullName: 'Alexander Taylor',
    email: 'alexander.taylor@idealschool.edu',
    className: 'Grade 12B',
    gender: 'male',
    UIN: 'STU008',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    classId: 'class-8',
    dateOfBirth: '2006-12-03',
    createdAt: '2024-01-22T10:45:00Z'
  }
];

const mockStudentDetails: Record<string, GetSingleStudentResponse> = {
  '1': {
    id: '1',
    fullName: 'Emma Johnson',
    dateOfBirth: '2008-03-15',
    email: 'emma.johnson@idealschool.edu',
    phoneNumber: '+1-555-1001',
    className: 'Grade 10A',
    address: '123 Oak Street, Springfield, IL 62701',
    gender: 'female',
    UIN: 'STU001',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    classId: 'class-3',
    middleName: 'Rose',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  '2': {
    id: '2',
    fullName: 'Michael Chen',
    dateOfBirth: '2007-07-22',
    email: 'michael.chen@idealschool.edu',
    phoneNumber: '+1-555-1002',
    className: 'Grade 11B',
    address: '456 Pine Avenue, Springfield, IL 62702',
    gender: 'male',
    UIN: 'STU002',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    classId: 'class-6',
    middleName: 'James',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  '3': {
    id: '3',
    fullName: 'Sarah Williams',
    dateOfBirth: '2009-11-08',
    email: 'sarah.williams@idealschool.edu',
    phoneNumber: '+1-555-1003',
    className: 'Grade 9A',
    address: '789 Maple Drive, Springfield, IL 62703',
    gender: 'female',
    UIN: 'STU003',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    classId: 'class-1',
    middleName: 'Elizabeth',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  '4': {
    id: '4',
    fullName: 'David Rodriguez',
    dateOfBirth: '2006-05-12',
    email: 'david.rodriguez@idealschool.edu',
    phoneNumber: '+1-555-1004',
    className: 'Grade 12A',
    address: '321 Elm Street, Springfield, IL 62704',
    gender: 'male',
    UIN: 'STU004',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    classId: 'class-7',
    middleName: 'Antonio',
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z'
  },
  '5': {
    id: '5',
    fullName: 'Olivia Brown',
    dateOfBirth: '2008-09-30',
    email: 'olivia.brown@idealschool.edu',
    phoneNumber: '+1-555-1005',
    className: 'Grade 10B',
    address: '654 Cedar Lane, Springfield, IL 62705',
    gender: 'female',
    UIN: 'STU005',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    classId: 'class-4',
    middleName: 'Grace',
    createdAt: '2024-01-19T16:30:00Z',
    updatedAt: '2024-01-19T16:30:00Z'
  },
  '6': {
    id: '6',
    fullName: 'James Wilson',
    dateOfBirth: '2007-01-18',
    email: 'james.wilson@idealschool.edu',
    phoneNumber: '+1-555-1006',
    className: 'Grade 11A',
    address: '987 Birch Road, Springfield, IL 62706',
    gender: 'male',
    UIN: 'STU006',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    classId: 'class-5',
    middleName: 'Robert',
    createdAt: '2024-01-20T08:15:00Z',
    updatedAt: '2024-01-20T08:15:00Z'
  },
  '7': {
    id: '7',
    fullName: 'Sophia Davis',
    dateOfBirth: '2009-04-25',
    email: 'sophia.davis@idealschool.edu',
    phoneNumber: '+1-555-1007',
    className: 'Grade 9B',
    address: '147 Willow Way, Springfield, IL 62707',
    gender: 'female',
    UIN: 'STU007',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    classId: 'class-2',
    middleName: 'Marie',
    createdAt: '2024-01-21T13:20:00Z',
    updatedAt: '2024-01-21T13:20:00Z'
  },
  '8': {
    id: '8',
    fullName: 'Alexander Taylor',
    dateOfBirth: '2006-12-03',
    email: 'alexander.taylor@idealschool.edu',
    phoneNumber: '+1-555-1008',
    className: 'Grade 12B',
    address: '258 Spruce Street, Springfield, IL 62708',
    gender: 'male',
    UIN: 'STU008',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    classId: 'class-8',
    middleName: 'Christopher',
    createdAt: '2024-01-22T10:45:00Z',
    updatedAt: '2024-01-22T10:45:00Z'
  }
};

export const useStudentStore = create<StudentState>((set, get) => ({
  // Initial state
  studentList: [],
  selectedStudent: null,
  classOptions: [],
  isLoading: false,
  error: null,

  // Actions
  fetchStudentList: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ studentList: mockStudentList, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch student list',
        isLoading: false 
      });
    }
  },

  fetchStudentById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const student = mockStudentDetails[id];
      if (!student) {
        throw new Error('Student not found');
      }
      set({ selectedStudent: student, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch student details',
        isLoading: false 
      });
    }
  },

  fetchClassOptions: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));
      set({ classOptions: mockClassOptions, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch class options',
        isLoading: false 
      });
    }
  },

  createStudent: async (studentData: CreateStudentRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate new student
      const newId = (mockStudentList.length + 1).toString();
      const newUIN = `STU${String(mockStudentList.length + 1).padStart(3, '0')}`;
      const className = mockClassOptions.find(c => c.id === studentData.classId)?.name || 'Unknown Class';
      
      const newStudent: GetManyStudentResponse = {
        id: newId,
        fullName: `${studentData.firstName} ${studentData.middleName ? studentData.middleName + ' ' : ''}${studentData.lastName}`,
        email: studentData.email,
        className,
        gender: studentData.gender,
        UIN: newUIN,
        profilePicture: typeof studentData.profilePicture === 'string' ? studentData.profilePicture : undefined,
        classId: studentData.classId,
        dateOfBirth: studentData.dateOfBirth,
        createdAt: new Date().toISOString()
      };

      // Add to mock data
      mockStudentList.push(newStudent);
      mockStudentDetails[newId] = {
        ...newStudent,
        phoneNumber: studentData.phoneNumber,
        address: studentData.address,
        middleName: studentData.middleName,
        updatedAt: new Date().toISOString()
      };

      set({ 
        studentList: [...mockStudentList], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create student',
        isLoading: false 
      });
    }
  },

  updateStudent: async (id: string, studentData: UpdateStudentRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const className = mockClassOptions.find(c => c.id === studentData.classId)?.name || 'Unknown Class';
      
      // Update mock data
      const studentIndex = mockStudentList.findIndex(student => student.id === id);
      if (studentIndex !== -1) {
        mockStudentList[studentIndex] = {
          ...mockStudentList[studentIndex],
          fullName: `${studentData.firstName} ${studentData.middleName ? studentData.middleName + ' ' : ''}${studentData.lastName}`,
          email: studentData.email,
          className,
          gender: studentData.gender,
          classId: studentData.classId,
          dateOfBirth: studentData.dateOfBirth,
          profilePicture: typeof studentData.profilePicture === 'string' ? studentData.profilePicture : mockStudentList[studentIndex].profilePicture
        };
      }

      if (mockStudentDetails[id]) {
        mockStudentDetails[id] = {
          ...mockStudentDetails[id],
          fullName: `${studentData.firstName} ${studentData.middleName ? studentData.middleName + ' ' : ''}${studentData.lastName}`,
          email: studentData.email,
          phoneNumber: studentData.phoneNumber,
          address: studentData.address,
          gender: studentData.gender,
          className,
          classId: studentData.classId,
          dateOfBirth: studentData.dateOfBirth,
          middleName: studentData.middleName,
          profilePicture: typeof studentData.profilePicture === 'string' ? studentData.profilePicture : mockStudentDetails[id].profilePicture,
          updatedAt: new Date().toISOString()
        };
      }

      set({ 
        studentList: [...mockStudentList],
        selectedStudent: mockStudentDetails[id] || null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update student',
        isLoading: false 
      });
    }
  },

  deleteStudent: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Remove from mock data
      const filteredList = mockStudentList.filter(student => student.id !== id);
      delete mockStudentDetails[id];

      set({ 
        studentList: filteredList,
        selectedStudent: null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete student',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedStudent: () => set({ selectedStudent: null })
}));
