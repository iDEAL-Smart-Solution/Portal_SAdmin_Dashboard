// Academic data management types and interfaces

export enum Term {
  first = 'first',
  second = 'second',
  third = 'third'
}

// Helper function to convert backend term number to Term enum
export const convertNumberToTerm = (termNumber: number): Term => {
  switch (termNumber) {
    case 1:
      return Term.first;
    case 2:
      return Term.second;
    case 3:
      return Term.third;
    default:
      return Term.first; // Default fallback
  }
};

// Helper function to convert Term enum to backend term number
export const convertTermToNumber = (term: Term): number => {
  switch (term) {
    case Term.first:
      return 1;
    case Term.second:
      return 2;
    case Term.third:
      return 3;
    default:
      return 1; // Default fallback
  }
};


export interface UpdateAcademicSessionRequest {
  Id: string;
  Current_Session: string;
  Current_Term: Term;
  NextTermBeginsOn?: string;
  CurrentTermEndsOn?: string;
}

export interface UpdateAcademicSessionDatesRequest {
  Id: string;
  NextTermBeginsOn?: string;
  CurrentTermEndsOn?: string;
}

export interface UpdateTermRequest {
  Current_Term: Term;
}

// Backend API Response Structure
export interface AcademicSessionApiResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    current_Session: string;
    current_Term: number; // 1, 2, 3
    schoolLogoFilePath: string | null;
    schoolName: string;
  };
}

// Frontend interface for internal use (normalized)
export interface GetAcademicSessionResponse {
  Id: string;
  Current_Session: string;
  Current_Term: Term;
  SchoolName?: string;
  SchoolLogoFilePath?: string;
  NextTermBeginsOn?: string;
  CurrentTermEndsOn?: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface AcademicSessionFormData {
  Current_Session: string;
  Current_Term: Term;
  NextTermBeginsOn?: string;
  CurrentTermEndsOn?: string;
}

export interface BrandingFormData {
  SchoolName: string;
  SchoolLogoFilePath?: File | string;
}

export interface UpdateBrandingRequest {
  SchoolName: string;
  SchoolLogoFilePath?: File | string;
}

export type TermType = 'First' | 'Second' | 'Third';
