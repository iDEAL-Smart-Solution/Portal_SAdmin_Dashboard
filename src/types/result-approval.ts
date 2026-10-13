// Types for Result Approval workflow

export interface PendingSubmissionDto {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  classId?: string;
  className?: string;
  term: number;
  session: string;
  submittedByTeacherId?: string;
  submittedByTeacherName?: string;
  submissionDate?: string;
  totalStudents: number;
  pendingCount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'PartiallyApproved' | string;
}

export interface StudentResultItemDto {
  resultId: string;
  studentId: string;
  studentUin: string;
  studentFullName: string;
  first_CA_Score: number;
  second_CA_Score: number;
  third_CA_Score: number;
  exam_Score: number;
  total_Score: number;
  grade: string;
  status: 'Pending' | 'Approved' | 'Rejected' | string;
  rejectionReason?: string | null;
}

export interface SubmissionDetailDto {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  className?: string;
  term: number;
  session: string;
  submittedBy?: string;
  submittedAt?: string;
  results: StudentResultItemDto[];
}

export interface ApproveSubmissionRequest {
  subjectId: string;
  term: number;
  session: string;
  classId?: string;
}

export interface RejectResultRequest {
  reason: string;
}
