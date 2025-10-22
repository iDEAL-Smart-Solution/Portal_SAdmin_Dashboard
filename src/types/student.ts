// Student management types and interfaces

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  classId: string;
  address: string;
  password: string;
  gender: string;
  profilePicture: File;
  birthCertificate: File;
  previousResulturl: File;
}

export interface UpdateStudentRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  classId: string;
  address: string;
  gender: string;
  profilePicture?: File;
}

// Backend API response structure
export interface StudentApiResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    fullName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    className: string;
    address: string;
    phonenumber: string; // Note: backend has both phoneNumber and phonenumber
    gender: string;
    UIN: string;
  };
}

export interface GetSingleStudentResponse {
  id: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  className: string;
  address: string;
  gender: string;
  UIN: string;
}

export interface GetManyStudentResponse {
  id: string;
  fullName: string;
  email: string;
  className: string;
  gender: string;
  UIN: string;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  classId: string;
  address: string;
  gender: string;
  profilePicture?: File;
  birthCertificate?: File;
  previousResulturl?: File;
  password?: string; // Only for create form
}

export interface ClassOption {
  id: string;
  name: string;
  studentCount: number;
  subjectCount: number;
}

export type StudentGender = 'male' | 'female' | 'other';
