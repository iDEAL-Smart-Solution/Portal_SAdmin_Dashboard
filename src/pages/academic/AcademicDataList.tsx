import React, { useEffect } from 'react';
import { useAcademicStore } from '../../stores/academic-store';
import CurrentSessionCard from '../../components/academic/CurrentSessionCard';
import TermSelector from '../../components/academic/TermSelector';
import { Term } from '../../types/academic';

interface AcademicDataListProps {
  onEditSession: () => void;
  onUpdateBranding: () => void;
  onUpdateDates: () => void;
}

const AcademicDataList: React.FC<AcademicDataListProps> = ({ 
  onEditSession, 
  onUpdateBranding,
  onUpdateDates
}) => {
  const { 
    currentSession, 
    isLoading, 
    error, 
    fetchCurrentSession, 
    updateCurrentTerm,
    migrateToNextSession,
    moveToNextTerm,
    clearError 
  } = useAcademicStore();

  useEffect(() => {
    fetchCurrentSession();
  }, [fetchCurrentSession]);

  const handleTermChange = async (term: Term) => {
    try {
      await updateCurrentTerm({ Current_Term: term });
    } catch (err) {
      console.error('Failed to update term:', err);
    }
  };

  const handleMigrateToNextSession = async () => {
    if (window.confirm('Are you sure you want to migrate to the next academic session? This action cannot be undone.')) {
      try {
        await migrateToNextSession();
      } catch (err) {
        console.error('Failed to migrate to next session:', err);
      }
    }
  };

  const handleMoveToNextTerm = async () => {
    if (window.confirm('Are you sure you want to move to the next term? This will update the current academic session.')) {
      try {
        await moveToNextTerm();
      } catch (err) {
        console.error('Failed to move to next term:', err);
      }
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading academic data</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    clearError();
                    fetchCurrentSession();
                  }}
                  className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Academic Data Management</h1>
            <p className="mt-2 text-gray-600">
              Manage your current academic session and school branding
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : !currentSession ? (
        /* No Session State */
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No academic session found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Academic sessions are managed by the system administrator.
          </p>
          <div className="mt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 max-w-md mx-auto">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Please contact your system administrator to set up an academic session.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Current Session Display */
        <div className="space-y-6">
          {/* Current Session Card */}
          <CurrentSessionCard
            session={currentSession}
            onUpdateSession={onEditSession}
            onUpdateBranding={onUpdateBranding}
            onUpdateDates={onUpdateDates}
          />

          {/* Term Selector */}
          <TermSelector
            currentTerm={currentSession.Current_Term}
            onTermChange={handleTermChange}
            isLoading={isLoading}
          />

          {/* Migration Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Academic Migration</h3>
                <p className="text-sm text-gray-600">Manage academic progression and transitions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleMoveToNextTerm}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Move to Next Term
              </button>

              <button
                onClick={handleMigrateToNextSession}
                disabled={isLoading}
                className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Migrate to Next Session
              </button>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-yellow-800">Important Notes</h4>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Move to Next Term:</strong> Updates the current session to the next term (First → Second → Third)</li>
                      <li><strong>Migrate to Next Session:</strong> Creates a new academic session and makes it active</li>
                      <li>These actions will affect all academic operations across the system</li>
                      <li>Make sure all current academic activities are completed before migration</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicDataList;
