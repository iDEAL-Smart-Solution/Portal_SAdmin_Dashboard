import React, { useEffect } from 'react';
import { useAcademicStore } from '../../stores/academic-store';
import AcademicSessionForm from '../../components/academic/AcademicSessionForm';
import { UpdateAcademicSessionRequest, AcademicSessionFormData } from '../../types/academic';

interface UpdateAcademicSessionProps {
  sessionId: string;
  onBack: () => void;
  onSuccess: () => void;
}

const UpdateAcademicSession: React.FC<UpdateAcademicSessionProps> = ({ 
  sessionId, 
  onBack, 
  onSuccess 
}) => {
  const { 
    currentSession, 
    isLoading, 
    error, 
    fetchCurrentSession, 
    updateAcademicSession, 
    clearError 
  } = useAcademicStore();

  useEffect(() => {
    fetchCurrentSession();
  }, [fetchCurrentSession]);

  const handleSubmit = async (formData: AcademicSessionFormData) => {
    try {
      // Convert form data to UpdateAcademicSessionRequest
      const updateRequest: UpdateAcademicSessionRequest = {
        Id: currentSession?.Id || '1',
        Current_Session: formData.Current_Session,
        Current_Term: formData.Current_Term
      };

      await updateAcademicSession(updateRequest);
      onSuccess();
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to update academic session:', err);
    }
  };

  const handleCancel = () => {
    clearError();
    onBack();
  };

  // Convert currentSession to form data format
  const getInitialFormData = (): Partial<AcademicSessionFormData> => {
    if (!currentSession) return {};
    
    return {
      Current_Session: currentSession.Current_Session,
      Current_Term: currentSession.Current_Term
    };
  };

  if (isLoading && !currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading academic session</h3>
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
                  <button
                    onClick={onBack}
                    className="ml-3 bg-gray-100 px-3 py-2 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-200"
                  >
                    Go back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentSession) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Academic session not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The academic session you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-6">
              <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                Go back to academic data
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={onBack}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Academic Data
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Update Academic Session</h1>
              <p className="mt-2 text-gray-600">
                Update information for {currentSession.Current_Session}
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error updating academic session</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={clearError}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <AcademicSessionForm
          initialData={getInitialFormData()}
          isEdit={true}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />

        {/* Help Text */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">Update Information</h3>
              <div className="mt-2 text-sm text-purple-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>All fields marked with * are required</li>
                  <li>Academic session should be in the format YYYY/YYYY</li>
                  <li>Changes will be reflected across the system</li>
                  <li>Active status is managed separately from session details</li>
                  <li>School branding is managed independently</li>
                  <li>Update timestamps are automatically recorded</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAcademicSession;
