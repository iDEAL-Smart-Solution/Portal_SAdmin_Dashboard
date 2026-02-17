import React from 'react';
import { useStudentStore } from '../../stores/student-store';
import StudentForm from '../../components/student/StudentForm';
import { CreateStudentRequest, StudentFormData } from '../../types/student';

interface AddStudentProps {
  onBack: () => void;
  onSuccess: () => void;
}

const AddStudent: React.FC<AddStudentProps> = ({ onBack, onSuccess }) => {
  const { createStudent, isLoading, error, clearError } = useStudentStore();

  const handleSubmit = async (formData: StudentFormData) => {
    try {
      // Convert form data to CreateStudentRequest
      const createRequest: CreateStudentRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        dateOfBirth: new Date(formData.dateOfBirth),
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        classId: formData.classId,
        address: formData.address,
        password: formData.password || '',
        gender: formData.gender,
        profilePicture: formData.profilePicture as File,
        birthCertificate: formData.birthCertificate as File,
        previousResulturl: formData.previousResulturl as File
      };

      await createStudent(createRequest);
      onSuccess();
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to create student:', err);
    }
  };

  const handleCancel = () => {
    clearError();
    onBack();
  };

  return (
    <div className="bg-gray-50 py-8">
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
                Back to Student List
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Add New Student</h1>
              <p className="mt-2 text-gray-600">
                Create a new student account for your school
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
                <h3 className="text-sm font-medium text-red-800">Error creating student</h3>
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
        <StudentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />

        {/* Help Text */}
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-primary-800">Important Information</h3>
              <div className="mt-2 text-sm text-primary-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>All fields marked with * are required</li>
                  <li>First name, middle name, and last name are all important for student identification</li>
                  <li>The student will receive login credentials via email</li>
                  <li>Profile picture is optional but recommended</li>
                  <li>Date of birth must be valid (age 5-25 years)</li>
                  <li>Class selection determines the student's academic year</li>
                        {/* File Type Instructions */}
                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800">File Upload Requirements</h3>
                              <div className="mt-2 text-sm text-yellow-700">
                                <ul className="list-disc pl-5 space-y-1">
                                  <li>Profile Picture: Only .jpg, .jpeg, .png files are accepted</li>
                                  <li>Student Files (e.g., birth certificate, previous results): Only .pdf, .docx, .png files are accepted</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
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
              <h3 className="text-sm font-medium text-blue-800">Student Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>A unique Student UIN will be automatically generated</li>
                  <li>Students can be assigned to different classes after creation</li>
                  <li>Contact information will be used for school communications</li>
                  <li>All student data is securely stored and protected</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
