// Student management types and interfaces

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string; // ISO date string
  email: string;
  phoneNumber: string;
  classId: string;
  address: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  profilePicture?: File | string;
}

export interface UpdateStudentRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string; // ISO date string
  email: string;
  phoneNumber: string;
  classId: string;
  address: string;
  gender: 'male' | 'female' | 'other';
  profilePicture?: File | string;
}

export interface GetSingleStudentResponse {
  id: string;
  fullName: string;
  dateOfBirth: string; // ISO date string
  email: string;
  phoneNumber: string;
  className: string;
  address: string;
  gender: 'male' | 'female' | 'other';
  UIN: string; // unique student identifier
  profilePicture?: string;
  classId: string;
  middleName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetManyStudentResponse {
  id: string;
  fullName: string;
  email: string;
  className: string;
  gender: 'male' | 'female' | 'other';
  UIN: string;
  profilePicture?: string;
  classId: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  classId: string;
  address: string;
  gender: 'male' | 'female' | 'other';
  profilePicture?: File | string;
  password?: string; // Only for create form
}

export interface ClassOption {
  id: string;
  name: string;
  grade: string;
  section: string;
}

export type StudentGender = 'male' | 'female' | 'other';
