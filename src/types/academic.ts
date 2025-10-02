// Academic data management types and interfaces

export enum Term {
  First = 'First',
  Second = 'Second',
  Third = 'Third'
}

export interface CreateAcademicSessionRequest {
  Current_Session: string; // e.g., "2025/2026"
  Current_Term: Term;
}

export interface UpdateAcademicSessionRequest {
  Id: string;
  Current_Session: string;
  Current_Term: Term;
}

export interface UpdateTermRequest {
  Current_Term: Term;
}

export interface GetAcademicSessionResponse {
  Id: string;
  Current_Session: string;
  Current_Term: Term;
  SchoolName?: string;
  SchoolLogoFilePath?: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface AcademicSessionFormData {
  Current_Session: string;
  Current_Term: Term;
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
