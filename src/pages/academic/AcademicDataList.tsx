import React, { useEffect } from 'react';
import { useAcademicStore } from '../../stores/academic-store';
import CurrentSessionCard from '../../components/academic/CurrentSessionCard';
import TermSelector from '../../components/academic/TermSelector';
import { Term } from '../../types/academic';

interface AcademicDataListProps {
  onEditSession: () => void;
  onUpdateBranding: () => void;
  onAddSession: () => void;
}

const AcademicDataList: React.FC<AcademicDataListProps> = ({ 
  onEditSession, 
  onUpdateBranding, 
  onAddSession 
}) => {
  const { 
    currentSession, 
    isLoading, 
    error, 
    fetchCurrentSession, 
    updateCurrentTerm,
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
          <button
            onClick={onAddSession}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Session
          </button>
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
            Get started by creating your first academic session.
          </p>
          <div className="mt-6">
            <button
              onClick={onAddSession}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Session
            </button>
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
          />

          {/* Term Selector */}
          <TermSelector
            currentTerm={currentSession.Current_Term}
            onTermChange={handleTermChange}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default AcademicDataList;
