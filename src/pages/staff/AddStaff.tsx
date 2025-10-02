import React from 'react';
import { useStaffStore } from '../../stores/staff-store';
import StaffForm from '../../components/staff/StaffForm';
import { CreateStaffRequest, StaffFormData } from '../../types/staff';

interface AddStaffProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AddStaff: React.FC<AddStaffProps> = ({ onBack, onSuccess }) => {
  const { createStaff, isLoading, error, clearError } = useStaffStore();

  const handleSubmit = async (formData: StaffFormData) => {
    try {
      // Convert form data to CreateStaffRequest
      const createRequest: CreateStaffRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        schoolId: 'school-1', // This would come from context/auth in real app
        address: formData.address,
        password: formData.password || '',
        gender: formData.gender,
        userName: formData.userName,
        profilePicture: formData.profilePicture
      };

      await createStaff(createRequest);
      onSuccess();
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to create staff:', err);
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
                Back to Staff List
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Add New Staff Member</h1>
              <p className="mt-2 text-gray-600">
                Create a new staff member account for your school
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
                <h3 className="text-sm font-medium text-red-800">Error creating staff member</h3>
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
        <StaffForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>All fields marked with * are required</li>
                  <li>The staff member will receive login credentials via email</li>
                  <li>Profile picture is optional but recommended</li>
                  <li>Username must be unique across the system</li>
                  <li>Subject assignments can be made after staff creation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
