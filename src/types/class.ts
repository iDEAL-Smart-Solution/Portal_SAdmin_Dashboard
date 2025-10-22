// Class management types and interfaces

export interface CreateClassRequest {
  name: string;
}

export interface UpdateClassRequest {
  id: string;
  newName: string;
}

export interface GetClassResponse {
  id: string;
  name: string;
  studentCount: number;
  subjectCount: number;
}

export interface ClassStudent {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface ClassSubject {
  id: string;
  name: string;
  subjectCode: string;
}

export interface GetAClassResponse {
  id: string;
  name: string;
  students: ClassStudent[];
  subjects: ClassSubject[];
}

// Backend API response structure
export interface ClassApiResponse {
  statusCode: number;
  message: string;
  data: GetAClassResponse;
}

export interface ClassFormData {
  name: string;
}
