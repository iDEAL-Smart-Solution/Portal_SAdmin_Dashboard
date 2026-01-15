// Subject Types
export interface SubjectDto {
  id: string;
  name: string;
  code: string;
  description: string;
  className: string;
  staffId: string;
  schoolId: string;
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  description: string;
  className: string;
  classId: string;
  staffId: string;
  schoolId: string;
}

export interface UpdateSubjectRequest {
  id: string;
  name: string;
  code: string;
  description: string;
  className: string;
  staffId: string;
}

export interface SubjectFormData {
  name: string;
  code: string;
  description: string;
  className: string;
  staffId: string;
}

export interface SubjectApiResponse {
  data: SubjectDto;
  success: boolean;
  message: string;
}

export interface GetManySubjectResponse {
  id: string;
  name: string;
  code: string;
  description: string;
  className: string;
  classId: string;
  staffId: string;
  staffName?: string;
  schoolId: string;
}

export interface GetSingleSubjectResponse {
  id: string;
  name: string;
  code: string;
  description: string;
  className: string;
  classId: string;
  staffId: string;
  staffName?: string;
  schoolId: string;
}

// Staff options for subject assignment
export interface StaffOption {
  id: string;
  fullName: string;
  email: string;
}

// Class options for subject assignment
export interface ClassOption {
  id: string;
  name: string;
  studentCount: number;
  subjectCount: number;
}
