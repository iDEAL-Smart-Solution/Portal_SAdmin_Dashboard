// Staff management types and interfaces

// Backend API Request/Response types (matching backend exactly)
export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  schoolId: string;
  address: string;
  password: string;
  gender: string; // Backend uses string, not enum
  userName: string;
  profilePicture: File; // Backend expects IFormFile
}

export interface UpdateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string; // Backend uses string, not enum
  userName: string;
  profilePicture?: File;
}

// Backend API Response structure (nested)
export interface StaffApiResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    gender: string;
    uin: string; // Backend uses lowercase
    profilePicture: string;
    subjectCodes: string[];
  };
}

// Frontend interface for staff data (normalized)
export interface GetSingleStaffResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string;
  UIN: string; // Normalized to uppercase for frontend consistency
  userName: string;
  profilePicture: string;
  subjectCodes?: string[];
}

export interface GetManyStaffResponse {
  id: string;
  fullName: string;
  email: string;
  gender: string;
  UIN: string;
  uin?: string; // Handle potential camelCase from API
  profilePicture: string;
}

// Frontend form data (for UI components)
export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: string; // Backend uses string
  userName: string;
  profilePicture?: File | string;
  password?: string; // Only for create form
  schoolId?: string; // Only for create form
}

// Gender options for UI dropdowns
export type StaffGender = 'male' | 'female' | 'other';
