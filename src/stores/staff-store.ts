import { create } from 'zustand';
import { 
  CreateStaffRequest, 
  UpdateStaffRequest, 
  GetSingleStaffResponse, 
  GetManyStaffResponse,
  StaffFormData 
} from '../types/staff';

interface StaffState {
  // Staff list
  staffList: GetManyStaffResponse[];
  selectedStaff: GetSingleStaffResponse | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchStaffList: () => Promise<void>;
  fetchStaffById: (id: string) => Promise<void>;
  createStaff: (staffData: CreateStaffRequest) => Promise<void>;
  updateStaff: (id: string, staffData: UpdateStaffRequest) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  clearError: () => void;
  clearSelectedStaff: () => void;
}

// Mock data for development
const mockStaffList: GetManyStaffResponse[] = [
  {
    id: '1',
    fullName: 'John Smith',
    email: 'john.smith@idealschool.edu',
    gender: 'male',
    UIN: 'STF001',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    subjectCodes: ['MATH101', 'PHYS201'],
    schoolId: 'school-1',
    userName: 'johnsmith',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@idealschool.edu',
    gender: 'female',
    UIN: 'STF002',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    subjectCodes: ['ENG101', 'LIT201'],
    schoolId: 'school-1',
    userName: 'sarahjohnson',
    createdAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    fullName: 'Michael Brown',
    email: 'michael.brown@idealschool.edu',
    gender: 'male',
    UIN: 'STF003',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    subjectCodes: ['SCI101', 'BIO201'],
    schoolId: 'school-1',
    userName: 'michaelbrown',
    createdAt: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    fullName: 'Emily Davis',
    email: 'emily.davis@idealschool.edu',
    gender: 'female',
    UIN: 'STF004',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    subjectCodes: ['HIST101', 'GEO201'],
    schoolId: 'school-1',
    userName: 'emilydavis',
    createdAt: '2024-01-18T11:45:00Z'
  },
  {
    id: '5',
    fullName: 'David Wilson',
    email: 'david.wilson@idealschool.edu',
    gender: 'male',
    UIN: 'STF005',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    subjectCodes: ['ART101', 'MUS201'],
    schoolId: 'school-1',
    userName: 'davidwilson',
    createdAt: '2024-01-19T16:30:00Z'
  }
];

const mockStaffDetails: Record<string, GetSingleStaffResponse> = {
  '1': {
    id: '1',
    fullName: 'John Smith',
    email: 'john.smith@idealschool.edu',
    phoneNumber: '+1-555-0123',
    address: '123 Main St, Anytown, ST 12345',
    gender: 'male',
    UIN: 'STF001',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    subjectCodes: ['MATH101', 'PHYS201'],
    schoolId: 'school-1',
    userName: 'johnsmith',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  '2': {
    id: '2',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@idealschool.edu',
    phoneNumber: '+1-555-0124',
    address: '456 Oak Ave, Anytown, ST 12345',
    gender: 'female',
    UIN: 'STF002',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    subjectCodes: ['ENG101', 'LIT201'],
    schoolId: 'school-1',
    userName: 'sarahjohnson',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  '3': {
    id: '3',
    fullName: 'Michael Brown',
    email: 'michael.brown@idealschool.edu',
    phoneNumber: '+1-555-0125',
    address: '789 Pine St, Anytown, ST 12345',
    gender: 'male',
    UIN: 'STF003',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    subjectCodes: ['SCI101', 'BIO201'],
    schoolId: 'school-1',
    userName: 'michaelbrown',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  '4': {
    id: '4',
    fullName: 'Emily Davis',
    email: 'emily.davis@idealschool.edu',
    phoneNumber: '+1-555-0126',
    address: '321 Elm St, Anytown, ST 12345',
    gender: 'female',
    UIN: 'STF004',
    profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    subjectCodes: ['HIST101', 'GEO201'],
    schoolId: 'school-1',
    userName: 'emilydavis',
    createdAt: '2024-01-18T11:45:00Z',
    updatedAt: '2024-01-18T11:45:00Z'
  },
  '5': {
    id: '5',
    fullName: 'David Wilson',
    email: 'david.wilson@idealschool.edu',
    phoneNumber: '+1-555-0127',
    address: '654 Maple Dr, Anytown, ST 12345',
    gender: 'male',
    UIN: 'STF005',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    subjectCodes: ['ART101', 'MUS201'],
    schoolId: 'school-1',
    userName: 'davidwilson',
    createdAt: '2024-01-19T16:30:00Z',
    updatedAt: '2024-01-19T16:30:00Z'
  }
};

export const useStaffStore = create<StaffState>((set, get) => ({
  // Initial state
  staffList: [],
  selectedStaff: null,
  isLoading: false,
  error: null,

  // Actions
  fetchStaffList: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ staffList: mockStaffList, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch staff list',
        isLoading: false 
      });
    }
  },

  fetchStaffById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      const staff = mockStaffDetails[id];
      if (!staff) {
        throw new Error('Staff member not found');
      }
      set({ selectedStaff: staff, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch staff details',
        isLoading: false 
      });
    }
  },

  createStaff: async (staffData: CreateStaffRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate new staff member
      const newId = (mockStaffList.length + 1).toString();
      const newUIN = `STF${String(mockStaffList.length + 1).padStart(3, '0')}`;
      const newStaff: GetManyStaffResponse = {
        id: newId,
        fullName: `${staffData.firstName} ${staffData.lastName}`,
        email: staffData.email,
        gender: staffData.gender,
        UIN: newUIN,
        profilePicture: typeof staffData.profilePicture === 'string' ? staffData.profilePicture : undefined,
        subjectCodes: [], // Will be assigned later
        schoolId: staffData.schoolId,
        userName: staffData.userName,
        createdAt: new Date().toISOString()
      };

      // Add to mock data
      mockStaffList.push(newStaff);
      mockStaffDetails[newId] = {
        ...newStaff,
        phoneNumber: staffData.phoneNumber,
        address: staffData.address,
        updatedAt: new Date().toISOString()
      };

      set({ 
        staffList: [...mockStaffList], 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create staff member',
        isLoading: false 
      });
    }
  },

  updateStaff: async (id: string, staffData: UpdateStaffRequest) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Update mock data
      const staffIndex = mockStaffList.findIndex(staff => staff.id === id);
      if (staffIndex !== -1) {
        mockStaffList[staffIndex] = {
          ...mockStaffList[staffIndex],
          fullName: `${staffData.firstName} ${staffData.lastName}`,
          email: staffData.email,
          gender: staffData.gender,
          userName: staffData.userName,
          profilePicture: typeof staffData.profilePicture === 'string' ? staffData.profilePicture : mockStaffList[staffIndex].profilePicture
        };
      }

      if (mockStaffDetails[id]) {
        mockStaffDetails[id] = {
          ...mockStaffDetails[id],
          fullName: `${staffData.firstName} ${staffData.lastName}`,
          email: staffData.email,
          phoneNumber: staffData.phoneNumber,
          address: staffData.address,
          gender: staffData.gender,
          userName: staffData.userName,
          profilePicture: typeof staffData.profilePicture === 'string' ? staffData.profilePicture : mockStaffDetails[id].profilePicture,
          updatedAt: new Date().toISOString()
        };
      }

      set({ 
        staffList: [...mockStaffList],
        selectedStaff: mockStaffDetails[id] || null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update staff member',
        isLoading: false 
      });
    }
  },

  deleteStaff: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Remove from mock data
      const filteredList = mockStaffList.filter(staff => staff.id !== id);
      delete mockStaffDetails[id];

      set({ 
        staffList: filteredList,
        selectedStaff: null,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete staff member',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  clearSelectedStaff: () => set({ selectedStaff: null })
}));
