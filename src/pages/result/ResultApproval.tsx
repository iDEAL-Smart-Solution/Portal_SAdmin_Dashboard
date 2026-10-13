import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../lib/axios';
import { showError, showSuccess } from '../../lib/notifications';

interface PendingSubmission {
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  className?: string;
  term: number;
  session?: string;
  totalStudents?: number;
  status?: string;
  pendingCount?: number;
  rejectedCount?: number;
  approvedCount?: number;
}

interface SubmissionDetailRow {
  id: string;
  resultId?: string;
  studentId: string;
  studentUin: string;
  studentName: string;
  className?: string;
  first_CA_Score: number;
  second_CA_Score: number;
  third_CA_Score: number;
  exam_Score: number;
  total_Score: number;
  grade: string;
  status?: string;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  reviewedByName?: string | null;
}

const normalizeSubmissionRows = (rows: any[]): SubmissionDetailRow[] =>
  rows.map((row) => {
    const firstCA = Number(row.firstCA ?? row.first_CA_Score ?? 0);
    const secondCA = Number(row.secondCA ?? row.second_CA_Score ?? 0);
    const thirdCA = Number(row.thirdCA ?? row.third_CA_Score ?? 0);
    const exam = Number(row.exam ?? row.exam_Score ?? 0);
    const total = Number(row.totalScore ?? row.total_Score ?? firstCA + secondCA + thirdCA + exam);

    return {
      id: row.resultId ?? row.id ?? row.studentId ?? '',
      resultId: row.resultId ?? row.id ?? undefined,
      studentId: row.studentId ?? '',
      studentUin: row.studentUin ?? row.studentUIN ?? '',
      studentName: row.studentName ?? 'Unknown student',
      className: row.className ?? '',
      first_CA_Score: firstCA,
      second_CA_Score: secondCA,
      third_CA_Score: thirdCA,
      exam_Score: exam,
      total_Score: total,
      grade: row.grade ?? 'N/A',
      status: row.status ?? 'PendingApproval',
      rejectionReason: row.rejectionReason ?? null,
      reviewedAt: row.reviewedAt ?? null,
      reviewedByName: row.reviewedByName ?? null,
    };
  });

const getStatusLabel = (status?: string) => {
  const normalized = (status ?? '').toLowerCase();

  if (normalized.includes('rejected')) return 'Rejected';
  if (normalized.includes('approved')) return 'Approved';
  return 'Pending';
};

const getStatusClassName = (status?: string) => {
  const normalized = (status ?? '').toLowerCase();

  if (normalized.includes('rejected')) return 'bg-red-100 text-red-700 border-red-200';
  if (normalized.includes('approved')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  return 'bg-amber-100 text-amber-700 border-amber-200';
};

const isRejectedStatus = (status?: string) => (status ?? '').toLowerCase().includes('rejected');

interface ResultApprovalProps {
  onBack?: () => void;
}

const ResultApproval: React.FC<ResultApprovalProps> = ({ onBack }) => {
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<PendingSubmission | null>(null);
  const [submissionRows, setSubmissionRows] = useState<SubmissionDetailRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<SubmissionDetailRow | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [termFilter, setTermFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');

  const loadPendingSubmissions = async () => {
    try {
      setIsRefreshing(true);
      const response = await axiosInstance.get('/result-approval/pending-submissions');
      const submissions = Array.isArray(response.data) ? response.data : [];
      setPendingSubmissions(submissions);

      if (submissions.length === 0) {
        setSelectedSubmission(null);
        setSubmissionRows([]);
        return;
      }

      const shouldKeepSelection = selectedSubmission && submissions.some(
        (item: PendingSubmission) =>
          item.subjectId === selectedSubmission.subjectId &&
          item.term === selectedSubmission.term &&
          item.session === selectedSubmission.session
      );

      const chosen = shouldKeepSelection ? selectedSubmission : submissions[0];
      setSelectedSubmission(chosen);
      await loadSubmissionDetail(chosen);
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Unable to load pending result submissions.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadSubmissionDetail = async (submission: PendingSubmission) => {
    if (!submission) return;

    setSelectedSubmission(submission);
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/result-approval/submissions/${submission.subjectId}/${submission.term}`, {
        params: { session: submission.session },
      });

      const rawRows = Array.isArray(response.data?.items)
        ? response.data.items
        : Array.isArray(response.data?.results)
          ? response.data.results
          : Array.isArray(response.data)
            ? response.data
            : [];

      setSubmissionRows(normalizeSubmissionRows(rawRows));
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Unable to load this submission batch.');
      setSubmissionRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingSubmissions();
  }, []);

  const approveSubmission = async (submission: PendingSubmission) => {
    try {
      await axiosInstance.post('/result-approval/approve', {
        subjectId: submission.subjectId,
        term: submission.term,
        session: submission.session,
      });
      showSuccess('Submission approved successfully.');
      await loadPendingSubmissions();
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Unable to approve this result batch.');
    }
  };

  const rejectResult = async (row: SubmissionDetailRow) => {
    setRejectTarget(row);
    setRejectionReason('');
    setIsRejectModalOpen(true);
  };

  const submitRejection = async () => {
    if (!rejectTarget) return;

    const reason = rejectionReason.trim();
    if (!reason) {
      showError('Please provide a rejection reason before submitting.');
      return;
    }

    try {
      setIsRejecting(true);
      const resultId = rejectTarget.resultId ?? rejectTarget.id;
      await axiosInstance.post(`/result-approval/${resultId}/reject`, {
        reason,
      });
      showSuccess('Result rejected successfully.');
      setIsRejectModalOpen(false);
      setRejectTarget(null);
      setRejectionReason('');
      await loadPendingSubmissions();
    } catch (error: any) {
      showError(error?.response?.data?.message || 'Unable to reject this student result.');
    } finally {
      setIsRejecting(false);
    }
  };

  const uniqueSessions = useMemo(
    () => Array.from(new Set(pendingSubmissions.map((item) => item.session).filter(Boolean))),
    [pendingSubmissions]
  );

  const filteredSubmissions = useMemo(() => {
    return pendingSubmissions.filter((submission) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesQuery =
        query.length === 0 ||
        submission.subjectName.toLowerCase().includes(query) ||
        submission.subjectCode.toLowerCase().includes(query) ||
        submission.className?.toLowerCase().includes(query) ||
        submission.session?.toLowerCase().includes(query);

      const matchesTerm = termFilter === 'all' || String(submission.term) === termFilter;
      const matchesSession = sessionFilter === 'all' || submission.session === sessionFilter;

      return matchesQuery && matchesTerm && matchesSession;
    });
  }, [pendingSubmissions, searchTerm, termFilter, sessionFilter]);

  const selectedTotal = selectedSubmission?.totalStudents ?? submissionRows.length;

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="w-full px-4 py-6 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-primary-600 hover:text-primary-700 mb-2 inline-flex items-center"
              >
                ← Back to Results
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">Result Approvals</h1>
            <p className="text-gray-600 mt-1">Review and approve subject result submissions before publishing</p>
          </div>

          <button
            onClick={loadPendingSubmissions}
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-orange-300 bg-white text-orange-700 hover:bg-orange-50 font-medium"
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Submissions'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{pendingSubmissions.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Selected batch</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{selectedTotal}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Visible</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{filteredSubmissions.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by subject, class, or session"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic term</label>
              <select
                value={termFilter}
                onChange={(e) => setTermFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Terms</option>
                <option value="1">First Term</option>
                <option value="2">Second Term</option>
                <option value="3">Third Term</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Sessions</option>
                {uniqueSessions.map((session) => (
                  <option key={session} value={session}>{session}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)] 2xl:grid-cols-[460px_minmax(0,1fr)]">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Pending submissions</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredSubmissions.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No matching submissions found.
                </div>
              ) : (
                filteredSubmissions.map((submission) => {
                  const isSelected =
                    selectedSubmission?.subjectId === submission.subjectId &&
                    selectedSubmission?.term === submission.term &&
                    selectedSubmission?.session === submission.session;

                  const hasRejected = (submission.rejectedCount ?? 0) > 0;
                  const hasPending = (submission.pendingCount ?? 0) > 0;
                  const statusLabel = hasRejected && hasPending ? 'Mixed' : hasRejected ? 'Rejected' : 'Pending';
                  const statusClass = hasRejected && hasPending
                    ? 'bg-orange-100 text-orange-700 border-orange-200'
                    : hasRejected
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : 'bg-yellow-100 text-yellow-800 border-yellow-200';

                  return (
                    <button
                      key={`${submission.subjectId}-${submission.term}-${submission.session}`}
                      type="button"
                      onClick={() => loadSubmissionDetail(submission)}
                      className={`w-full text-left p-4 transition ${
                        isSelected ? 'bg-orange-50 border-l-4 border-orange-500' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{submission.subjectName}</p>
                          <p className="text-xs text-gray-500">{submission.subjectCode}</p>
                        </div>
                        <span className={`inline-flex items-center border px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>

                      <div className="mt-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Class</span>
                          <span>{submission.className || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Term</span>
                          <span>{submission.term}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Session</span>
                          <span>{submission.session || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Students</span>
                          <span>{submission.totalStudents ?? 0}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Pending</span>
                          <span>{submission.pendingCount ?? 0}</span>
                        </div>
                        {hasRejected && (
                          <div className="flex justify-between mt-1">
                            <span>Rejected</span>
                            <span>{submission.rejectedCount ?? 0}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 p-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedSubmission ? `${selectedSubmission.subjectName} results` : 'Submission preview'}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedSubmission ? `Term ${selectedSubmission.term} • ${selectedSubmission.session || 'N/A'}` : 'Select a submission to review'}
                </p>
              </div>

              {selectedSubmission && (
                <button
                  type="button"
                  onClick={() => approveSubmission(selectedSubmission)}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-medium"
                >
                  Approve batch
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-gray-500">Loading submission details...</div>
            ) : submissionRows.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                {selectedSubmission ? 'No student rows available for this submission.' : 'Select a submission to begin approval.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">Student</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700">UIN</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">CA1</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">CA2</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">CA3</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Exam</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Total</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Grade</th>
                      <th className="px-4 py-3 text-center font-medium text-gray-700">Status</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {submissionRows.map((row) => (
                      <tr key={row.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{row.studentName}</div>
                          {/* <div className="text-xs text-gray-500">{row.className || 'No class'}</div> */}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-700">{row.studentUin}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{row.first_CA_Score}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{row.second_CA_Score}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{row.third_CA_Score}</td>
                        <td className="px-4 py-3 text-center text-gray-700">{row.exam_Score}</td>
                        <td className="px-4 py-3 text-center font-semibold text-gray-900">{row.total_Score}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {row.grade || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center border px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClassName(row.status)}`}>
                            {getStatusLabel(row.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isRejectedStatus(row.status) ? (
                            <span className="text-xs font-medium text-red-700">Already rejected</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => rejectResult(row)}
                              className="inline-flex items-center px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 font-medium"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {isRejectModalOpen && rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Reject result</h3>
                  <p className="text-sm text-slate-500">{rejectTarget.studentName}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectTarget(null);
                    setRejectionReason('');
                  }}
                  className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close rejection form"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">Rejection reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
                placeholder="Explain why this result is being rejected..."
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectTarget(null);
                  setRejectionReason('');
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitRejection}
                disabled={isRejecting || !rejectionReason.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isRejecting ? 'Rejecting...' : 'Reject result'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultApproval;
