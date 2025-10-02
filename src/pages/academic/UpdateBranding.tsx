import React from 'react';
import { useAcademicStore } from '../../stores/academic-store';
import BrandingForm from '../../components/academic/BrandingForm';
import { UpdateBrandingRequest, BrandingFormData } from '../../types/academic';

interface UpdateBrandingProps {
  onBack: () => void;
  onSuccess: () => void;
}

const UpdateBranding: React.FC<UpdateBrandingProps> = ({ onBack, onSuccess }) => {
  const { updateBranding, currentBranding, isLoading, error, clearError } = useAcademicStore();

  const handleSubmit = async (formData: BrandingFormData) => {
    try {
      // Convert form data to UpdateBrandingRequest
      const updateRequest: UpdateBrandingRequest = {
        SchoolName: formData.SchoolName,
        SchoolLogoFilePath: formData.SchoolLogoFilePath
      };

      await updateBranding(updateRequest);
      onSuccess();
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to update branding:', err);
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
              <h1 className="text-3xl font-bold text-gray-900">Update School Branding</h1>
              <p className="mt-2 text-gray-600">
                Update your school's name and logo across all academic sessions
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
                <h3 className="text-sm font-medium text-red-800">Error updating branding</h3>
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
        <BrandingForm
          initialData={currentBranding}
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
              <h3 className="text-sm font-medium text-purple-800">Branding Information</h3>
              <div className="mt-2 text-sm text-purple-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>School name is required and will be displayed throughout the system</li>
                  <li>Logo is optional but recommended for professional appearance</li>
                  <li>Supported image formats: PNG, JPG, GIF (max 5MB)</li>
                  <li>Changes will be applied to all academic sessions</li>
                  <li>Logo will be displayed in headers, reports, and documents</li>
                  <li>Branding updates are reflected immediately across the system</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Current Branding Preview */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Branding</h3>
          <div className="flex items-center space-x-4">
            {currentBranding.SchoolLogoFilePath && (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 border-2 border-gray-300">
                <img
                  src={typeof currentBranding.SchoolLogoFilePath === 'string' 
                    ? currentBranding.SchoolLogoFilePath 
                    : URL.createObjectURL(currentBranding.SchoolLogoFilePath)}
                  alt="Current School Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h4 className="text-xl font-semibold text-gray-900">
                {currentBranding.SchoolName || 'School Name Not Set'}
              </h4>
              <p className="text-sm text-gray-600">Current branding configuration</p>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Branding Best Practices</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Use high-quality logo images for best results</li>
                  <li>Square or rectangular logos work best in most contexts</li>
                  <li>Ensure logo has good contrast for visibility</li>
                  <li>School name should be clear and professional</li>
                  <li>Branding consistency helps with school identity</li>
                  <li>Test logo visibility on different backgrounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateBranding;
