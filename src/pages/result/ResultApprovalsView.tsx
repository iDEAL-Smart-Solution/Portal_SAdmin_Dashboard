import React, { useEffect, useState, useMemo } from 'react';
import { useResultApprovalStore } from '../../stores/result-approval-store';
import { useAcademicStore } from '../../stores/academic-store';
import { PendingSubmissionDto } from '../../types/result-approval';
import SubmissionReviewModal from '../../components/result-approval/SubmissionReviewModal';
import { Button } from '../../components/ui/button';

type TabType = 'pending' | 'approved' | 'rejected';

const getTermName = (term: string | number): string => {
  switch (String(term)) {
    case '1': return 'First Term';
    case '2': return 'Second Term';
    case '3': return 'Third Term';
    default: return `Term ${term}`;
  }
};

const getStatusBadge = (status?: string) => {
  const norm = (status || '').toLowerCase();
  if (norm === 'approved') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        Approved
      </span>
    );
  }
  if (norm === 'rejected') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
        Rejected
      </span>
    );
  }
  if (norm === 'partiallyapproved') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
        Partially Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
      Pending
    </span>
  );
};

export const ResultApprovalsView: React.FC = () => {
  const {
    submissions,
    activeSubmission,
    isLoading,
    isDetailLoading,
    isActionLoading,
    error,
    fetchSubmissions,
    fetchSubmissionDetail,
    approveEntireSubmission,
    rejectIndividualResult,
    clearActiveSubmission,
  } = useResultApprovalStore();

  const { currentSession, fetchCurrentSession } = useAcademicStore();

  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTerm, setFilterTerm] = useState<string>('');
  const [filterSession, setFilterSession] = useState<string>('');
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  useEffect(() => {
    fetchSubmissions();
    fetchCurrentSession();
  }, [fetchSubmissions, fetchCurrentSession]);

  // Unique sessions for filter dropdown
  const uniqueSessions = useMemo(() => {
    const list = Array.from(new Set(submissions.map(s => s.session))).filter(Boolean);
    if (currentSession?.Current_Session && !list.includes(currentSession.Current_Session)) {
      list.push(currentSession.Current_Session);
    }
    return list;
  }, [submissions, currentSession]);

  // Categorize submissions by tab
  const categorizedSubmissions = useMemo(() => {
    const pending: PendingSubmissionDto[] = [];
    const approved: PendingSubmissionDto[] = [];
    const rejected: PendingSubmissionDto[] = [];

    submissions.forEach(sub => {
      const statusNorm = (sub.status || '').toLowerCase();
      if (statusNorm === 'approved') {
        approved.push(sub);
      } else if (statusNorm === 'rejected') {
        rejected.push(sub);
      } else {
        pending.push(sub);
      }
    });

    return { pending, approved, rejected };
  }, [submissions]);

  // Filter based on active tab + search criteria
  const currentTabSubmissions = categorizedSubmissions[activeTab];

  const filteredSubmissions = useMemo(() => {
    return currentTabSubmissions.filter(sub => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        sub.subjectName?.toLowerCase().includes(query) ||
        sub.subjectCode?.toLowerCase().includes(query) ||
        sub.className?.toLowerCase().includes(query) ||
        sub.submittedByTeacherName?.toLowerCase().includes(query);

      const matchesTerm = !filterTerm || String(sub.term) === filterTerm;
      const matchesSession = !filterSession || sub.session === filterSession;

      return matchesSearch && matchesTerm && matchesSession;
    });
  }, [currentTabSubmissions, searchTerm, filterTerm, filterSession]);

  const handleOpenReview = async (sub: PendingSubmissionDto) => {
    setIsReviewOpen(true);
    await fetchSubmissionDetail(sub.subjectId, sub.term, sub.session);
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false);
    clearActiveSubmission();
  };

  const handleApproveSubmission = async (payload: { subjectId: string; term: number; session: string }) => {
    const success = await approveEntireSubmission(payload);
    if (success) {
      // Keep modal open so admin sees updated student status
      await fetchSubmissions();
    }
  };

  const handleRejectResult = async (resultId: string, reason: string) => {
    await rejectIndividualResult(resultId, { reason });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Result Approvals</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Review and approve subject result submissions from teachers across the school
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => fetchSubmissions()}
          disabled={isLoading}
          className="self-start sm:self-auto"
        >
          <svg className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Submissions
        </Button>
      </div>

      {/* Segmented Status Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'pending'
              ? 'bg-primary-500 text-white shadow-soft font-semibold'
              : 'bg-white text-text-secondary border border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <span>Pending Submissions</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            activeTab === 'pending' ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-700'
          }`}>
            {categorizedSubmissions.pending.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('approved')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'approved'
              ? 'bg-primary-500 text-white shadow-soft font-semibold'
              : 'bg-white text-text-secondary border border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <span>Approved Submissions</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            activeTab === 'approved' ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-700'
          }`}>
            {categorizedSubmissions.approved.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rejected')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'rejected'
              ? 'bg-primary-500 text-white shadow-soft font-semibold'
              : 'bg-white text-text-secondary border border-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <span>Rejected Submissions</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            activeTab === 'rejected' ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-700'
          }`}>
            {categorizedSubmissions.rejected.length}
          </span>
        </button>
      </div>

      {/* Filter Card */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium uppercase tracking-wide text-text-tertiary mb-1">
              Search Submissions
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by subject, class, code, or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-tertiary mb-1">
              Academic Term
            </label>
            <select
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="">All Terms</option>
              <option value="1">First Term</option>
              <option value="2">Second Term</option>
              <option value="3">Third Term</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-tertiary mb-1">
              Academic Session
            </label>
            <select
              value={filterSession}
              onChange={(e) => setFilterSession(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="">All Sessions</option>
              {uniqueSessions.map(sess => (
                <option key={sess} value={sess}>{sess}</option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || filterTerm || filterSession) && (
          <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-text-tertiary">
              Showing {filteredSubmissions.length} filtered results
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setFilterTerm('');
                setFilterSession('');
              }}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Submissions Table / Cards */}
      <div className="bg-white rounded-xl shadow-soft border border-neutral-200 overflow-hidden">
        {isLoading && submissions.length === 0 ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-3 text-sm text-gray-500">Loading submissions...</p>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-16 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-3 text-base font-medium text-gray-900">
              No {activeTab} submissions found
            </h3>
            <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
              {searchTerm || filterTerm || filterSession
                ? 'Try adjusting your search criteria or clearing filters.'
                : activeTab === 'pending'
                ? 'There are currently no subject result submissions waiting for approval.'
                : `No submissions with ${activeTab} status to display.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Subject & Code
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Class
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Term / Session
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Submitting Teacher
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Total Students
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Pending Count
                  </th>
                  <th className="px-6 py-3.5 text-center text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredSubmissions.map((sub, idx) => (
                  <tr key={`${sub.subjectId}-${sub.term}-${sub.session}-${idx}`} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-text-primary">{sub.subjectName}</p>
                      <p className="text-xs font-mono text-text-tertiary mt-0.5">{sub.subjectCode}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-800">
                        {sub.className || 'All Classes'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-text-primary font-medium">{getTermName(sub.term)}</p>
                      <p className="text-xs text-text-tertiary">{sub.session}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-text-primary">{sub.submittedByTeacherName || 'Subject Teacher'}</p>
                      {sub.submissionDate && (
                        <p className="text-xs text-text-tertiary">{new Date(sub.submissionDate).toLocaleDateString()}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-text-primary">
                      {sub.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                        sub.pendingCount > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {sub.pendingCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(sub.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenReview(sub)}
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Review Submission
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submission Review Modal */}
      <SubmissionReviewModal
        isOpen={isReviewOpen}
        onClose={handleCloseReview}
        submission={activeSubmission}
        isLoading={isDetailLoading}
        isActionLoading={isActionLoading}
        onApproveSubmission={handleApproveSubmission}
        onRejectResult={handleRejectResult}
      />
    </div>
  );
};

export default ResultApprovalsView;
