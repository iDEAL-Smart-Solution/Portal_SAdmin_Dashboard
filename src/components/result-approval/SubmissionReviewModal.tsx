import React, { useState } from 'react';
import Modal from '../ui/modal';
import { Button } from '../ui/button';
import { SubmissionDetailDto, StudentResultItemDto } from '../../types/result-approval';
import RejectionReasonModal from './RejectionReasonModal';

interface SubmissionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionDetailDto | null;
  isLoading: boolean;
  isActionLoading: boolean;
  onApproveSubmission: (payload: { subjectId: string; term: number; session: string }) => Promise<void>;
  onRejectResult: (resultId: string, reason: string) => Promise<void>;
}

const getTermName = (term: string | number): string => {
  switch (String(term)) {
    case '1': return 'First Term';
    case '2': return 'Second Term';
    case '3': return 'Third Term';
    default: return `Term ${term}`;
  }
};

const getGradeColor = (grade?: string): string => {
  switch (grade?.toUpperCase()) {
    case 'A': return 'bg-green-100 text-green-800 border-green-200';
    case 'B': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'D': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'E': return 'bg-pink-100 text-pink-800 border-pink-200';
    default: return 'bg-red-100 text-red-800 border-red-200';
  }
};

const getStatusBadge = (status?: string) => {
  const norm = (status || 'pending').toLowerCase();
  if (norm === 'approved') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <svg className="w-3 h-3 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        Approved
      </span>
    );
  }
  if (norm === 'rejected') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
        <svg className="w-3 h-3 mr-1 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
      <svg className="w-3 h-3 mr-1 text-yellow-600 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      Pending
    </span>
  );
};

export const SubmissionReviewModal: React.FC<SubmissionReviewModalProps> = ({
  isOpen,
  onClose,
  submission,
  isLoading,
  isActionLoading,
  onApproveSubmission,
  onRejectResult,
}) => {
  const [rejectingStudent, setRejectingStudent] = useState<StudentResultItemDto | null>(null);

  if (!isOpen) return null;

  const results = submission?.results || [];
  const pendingResults = results.filter(r => (r.status || '').toLowerCase() === 'pending');
  const approvedResults = results.filter(r => (r.status || '').toLowerCase() === 'approved');
  const rejectedResults = results.filter(r => (r.status || '').toLowerCase() === 'rejected');

  const canApprove = pendingResults.length > 0;

  const handleApprove = async () => {
    if (!submission || !canApprove) return;
    await onApproveSubmission({
      subjectId: submission.subjectId,
      term: submission.term,
      session: submission.session,
    });
  };

  const handleConfirmRejection = async (reason: string) => {
    if (!rejectingStudent) return;
    await onRejectResult(rejectingStudent.resultId, reason);
    setRejectingStudent(null);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">Review Subject Submission</span>
            {submission && (
              <span className="text-sm font-normal text-gray-500">
                ({submission.subjectCode} - {submission.subjectName})
              </span>
            )}
          </div>
        }
        size="lg"
      >
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-3 text-sm text-gray-500">Loading submission details...</p>
          </div>
        ) : !submission ? (
          <div className="py-12 text-center text-gray-500">
            <p>Submission details not found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Submission Metadata Banner */}
            <div className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-xs text-text-tertiary uppercase font-medium">Subject</span>
                  <p className="font-semibold text-text-primary mt-0.5">{submission.subjectName}</p>
                  <p className="text-xs font-mono text-text-tertiary">{submission.subjectCode}</p>
                </div>
                <div>
                  <span className="text-xs text-text-tertiary uppercase font-medium">Class & Academic Term</span>
                  <p className="font-semibold text-text-primary mt-0.5">{submission.className || 'General'}</p>
                  <p className="text-xs text-text-secondary">{getTermName(submission.term)} • {submission.session}</p>
                </div>
                <div>
                  <span className="text-xs text-text-tertiary uppercase font-medium">Submitted By</span>
                  <p className="font-semibold text-text-primary mt-0.5">{submission.submittedBy || 'Subject Teacher'}</p>
                  {submission.submittedAt && (
                    <p className="text-xs text-text-tertiary">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-xs text-text-tertiary uppercase font-medium">Summary Breakdown</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      {pendingResults.length} Pending
                    </span>
                    {approvedResults.length > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {approvedResults.length} Approved
                      </span>
                    )}
                    {rejectedResults.length > 0 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        {rejectedResults.length} Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submission-Level Approve Action */}
              <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
                <p className="text-xs text-text-secondary">
                  {canApprove
                    ? `Approving will mark all ${pendingResults.length} pending results as approved and make them immediately visible on report cards.`
                    : 'All results in this submission have been processed (no pending results remain).'}
                </p>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleApprove}
                  disabled={!canApprove || isActionLoading}
                  className="flex-shrink-0"
                >
                  {isActionLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Approving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve Submission ({pendingResults.length})
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Students Table */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-soft">
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-neutral-200 text-sm">
                  <thead className="bg-neutral-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-text-tertiary uppercase">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-text-tertiary uppercase">Student</th>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-text-tertiary uppercase">UIN</th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-text-tertiary uppercase">CA 1 (10)</th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-text-tertiary uppercase">CA 2 (10)</th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-text-tertiary uppercase">CA 3 (10)</th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-text-tertiary uppercase">Exam (70)</th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-text-tertiary uppercase">Total (100)</th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-text-tertiary uppercase">Grade</th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-text-tertiary uppercase">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-text-tertiary uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="px-4 py-8 text-center text-text-tertiary">
                          No student results found for this submission.
                        </td>
                      </tr>
                    ) : (
                      results.map((item, index) => {
                        const statusNorm = (item.status || 'pending').toLowerCase();
                        const isPending = statusNorm === 'pending';
                        const isRejected = statusNorm === 'rejected';

                        return (
                          <tr key={item.resultId} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-3 py-3 whitespace-nowrap text-xs text-text-tertiary">{index + 1}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <p className="font-medium text-text-primary">{item.studentFullName || 'Student'}</p>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap font-mono text-xs text-text-secondary">
                              {item.studentUin}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-center text-text-secondary">
                              {item.first_CA_Score}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-center text-text-secondary">
                              {item.second_CA_Score}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-center text-text-secondary">
                              {item.third_CA_Score}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-center text-text-secondary">
                              {item.exam_Score}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-center font-semibold text-text-primary">
                              {item.total_Score}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-center">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${getGradeColor(item.grade)}`}>
                                {item.grade || '-'}
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-center">
                              <div>
                                {getStatusBadge(item.status)}
                                {isRejected && item.rejectionReason && (
                                  <p className="text-[11px] text-red-600 mt-1 max-w-xs truncate" title={item.rejectionReason}>
                                    Reason: {item.rejectionReason}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                              {isPending ? (
                                <button
                                  type="button"
                                  onClick={() => setRejectingStudent(item)}
                                  disabled={isActionLoading}
                                  className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-accent-500 bg-accent-50 hover:bg-accent-100 rounded-md transition-colors disabled:opacity-50"
                                >
                                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                  Reject
                                </button>
                              ) : (
                                <span className="text-xs text-text-tertiary">None</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Individual Student Rejection Modal */}
      {rejectingStudent && (
        <RejectionReasonModal
          isOpen={!!rejectingStudent}
          onClose={() => setRejectingStudent(null)}
          studentName={rejectingStudent.studentFullName}
          studentUin={rejectingStudent.studentUin}
          isSubmitting={isActionLoading}
          onConfirm={handleConfirmRejection}
        />
      )}
    </>
  );
};

export default SubmissionReviewModal;
