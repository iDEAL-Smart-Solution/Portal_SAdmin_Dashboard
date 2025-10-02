// Staff management types and interfaces

export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  schoolId: string;
  address: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  userName: string;
  profilePicture?: File | string;
}

export interface UpdateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: 'male' | 'female' | 'other';
  userName: string;
  profilePicture?: File | string;
}

export interface GetSingleStaffResponse {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: 'male' | 'female' | 'other';
  UIN: string; // unique staff identifier
  profilePicture?: string;
  subjectCodes: string[];
  schoolId: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetManyStaffResponse {
  id: string;
  fullName: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  UIN: string;
  profilePicture?: string;
  subjectCodes: string[];
  schoolId: string;
  userName: string;
  createdAt: string;
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: 'male' | 'female' | 'other';
  userName: string;
  profilePicture?: File | string;
  password?: string; // Only for create form
}

export type StaffGender = 'male' | 'female' | 'other';
