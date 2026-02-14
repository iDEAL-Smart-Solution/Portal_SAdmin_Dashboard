import React, { useState, useEffect } from 'react';
import { UpdateAcademicSessionDatesRequest } from '../../types/academic';
import { useAcademicStore } from '../../stores/academic-store';

interface UpdateSessionDatesProps {
  sessionId: string;
  onSuccess: () => void;
  onBack: () => void;
}

const UpdateSessionDates: React.FC<UpdateSessionDatesProps> = ({
  sessionId,
  onSuccess,
  onBack
}) => {
  const { updateSessionDates, isLoading, currentSession } = useAcademicStore();
  const [formData, setFormData] = useState({
    CurrentTermEndsOn: '',
    NextTermBeginsOn: ''
  });

  // Load current session dates on mount
  useEffect(() => {
    if (currentSession) {
      setFormData({
        CurrentTermEndsOn: currentSession.CurrentTermEndsOn?.split('T')[0] || '',
        NextTermBeginsOn: currentSession.NextTermBeginsOn?.split('T')[0] || ''
      });
    }
  }, [currentSession]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: UpdateAcademicSessionDatesRequest = {
      Id: currentSession?.Id || sessionId,
      CurrentTermEndsOn: formData.CurrentTermEndsOn || undefined,
      NextTermBeginsOn: formData.NextTermBeginsOn || undefined
    };

    const result = await updateSessionDates(request);
    if (result.success) {
      onSuccess();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Academic Data
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Update Academic Session Dates</h1>
        <p className="mt-2 text-gray-600">
          Manage term end dates and next term start dates
        </p>
      </div>

      <div className="max-w-2xl bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Update Term Dates
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Term Ends On */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Term Ends On
          </label>
          <input
            type="date"
            value={formData.CurrentTermEndsOn}
            onChange={(e) => setFormData(prev => ({ ...prev, CurrentTermEndsOn: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            When does the current term end?
          </p>
        </div>

        {/* Next Term Begins On */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Next Term Begins On
          </label>
          <input
            type="date"
            value={formData.NextTermBeginsOn}
            onChange={(e) => setFormData(prev => ({ ...prev, NextTermBeginsOn: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            When does the next term begin?
          </p>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Date Preview</h3>
          <div className="text-sm text-gray-600">
            <p>
              <span className="font-medium">Current Term Ends:</span>{' '}
              {formData.CurrentTermEndsOn 
                ? new Date(formData.CurrentTermEndsOn).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : 'Not set'}
            </p>
            <p className="mt-1">
              <span className="font-medium">Next Term Begins:</span>{' '}
              {formData.NextTermBeginsOn 
                ? new Date(formData.NextTermBeginsOn).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : 'Not set'}
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              'Update Dates'
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default UpdateSessionDates;
