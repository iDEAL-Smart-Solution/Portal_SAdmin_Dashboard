import React from 'react';
import { useAcademicStore } from '../../stores/academic-store';
import AcademicSessionForm from '../../components/academic/AcademicSessionForm';
import { CreateAcademicSessionRequest, AcademicSessionFormData } from '../../types/academic';

interface AddAcademicSessionProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AddAcademicSession: React.FC<AddAcademicSessionProps> = ({ onBack, onSuccess }) => {
  const { createAcademicSession, isLoading, error, clearError } = useAcademicStore();

  const handleSubmit = async (formData: AcademicSessionFormData) => {
    try {
      // Convert form data to CreateAcademicSessionRequest
      const createRequest: CreateAcademicSessionRequest = {
        Current_Session: formData.Current_Session,
        Current_Term: formData.Current_Term
      };

      await createAcademicSession(createRequest);
      onSuccess();
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to create academic session:', err);
    }
  };

  const handleCancel = () => {
    clearError();
    onBack();
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Add New Academic Session</h1>
              <p className="mt-2 text-gray-600">
                Create a new academic session for your school
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
                <h3 className="text-sm font-medium text-red-800">Error creating academic session</h3>
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
              <h3 className="text-sm font-medium text-purple-800">Important Information</h3>
              <div className="mt-2 text-sm text-purple-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>All fields marked with * are required</li>
                  <li>Academic session should be in the format YYYY/YYYY (e.g., 2025/2026)</li>
                  <li>New sessions are created as inactive by default</li>
                  <li>You can set a session as active after creation</li>
                  <li>Only one session can be active at a time</li>
                  <li>School branding will be applied to all sessions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Academic Session Management</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Academic sessions help organize your school's academic calendar</li>
                  <li>Each session can have different terms (First, Second, Third)</li>
                  <li>Active sessions are used for current academic operations</li>
                  <li>You can manage multiple sessions for different academic years</li>
                  <li>Session data is used throughout the system for organization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAcademicSession;
