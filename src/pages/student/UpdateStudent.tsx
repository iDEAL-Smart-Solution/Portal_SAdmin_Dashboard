import React, { useEffect } from 'react';
import { useStudentStore } from '../../stores/student-store';
import StudentForm from '../../components/student/StudentForm';
import { UpdateStudentRequest, StudentFormData } from '../../types/student';

interface UpdateStudentProps {
  studentId: string;
  onBack: () => void;
  onSuccess: () => void;
}

const UpdateStudent: React.FC<UpdateStudentProps> = ({ studentId, onBack, onSuccess }) => {
  const { 
    selectedStudent, 
    isLoading, 
    error, 
    fetchStudentById, 
    updateStudent, 
    clearError 
  } = useStudentStore();

  useEffect(() => {
    if (studentId) {
      fetchStudentById(studentId);
    }
  }, [studentId, fetchStudentById]);

  const handleSubmit = async (formData: StudentFormData) => {
    try {
      // Convert form data to UpdateStudentRequest
      const updateRequest: UpdateStudentRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        classId: formData.classId,
        address: formData.address,
        gender: formData.gender,
        profilePicture: formData.profilePicture
      };

      await updateStudent(studentId, updateRequest);
      onSuccess();
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to update student:', err);
    }
  };

  const handleCancel = () => {
    clearError();
    onBack();
  };

  // Convert selectedStudent to form data format
  const getInitialFormData = (): Partial<StudentFormData> => {
    if (!selectedStudent) return {};
    
    const [firstName, ...nameParts] = selectedStudent.fullName.split(' ');
    const lastName = nameParts.pop() || '';
    const middleName = nameParts.join(' ');

    return {
      firstName,
      lastName,
      middleName: middleName || undefined,
      dateOfBirth: selectedStudent.dateOfBirth,
      email: selectedStudent.email,
      phoneNumber: selectedStudent.phoneNumber,
      classId: selectedStudent.classId,
      address: selectedStudent.address,
      gender: selectedStudent.gender,
      profilePicture: selectedStudent.profilePicture
    };
  };

  if (isLoading && !selectedStudent) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !selectedStudent) {
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
                <h3 className="text-sm font-medium text-red-800">Error loading student</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      clearError();
                      fetchStudentById(studentId);
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

  if (!selectedStudent) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Student not found</h3>
            <p className="mt-1 text-sm text-gray-500">
              The student you're looking for doesn't exist or has been removed.
            </p>
            <div className="mt-6">
              <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Go back to student list
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
                Back to Student Profile
              </button>
              <h1 className="text-3xl font-bold text-gray-900">Update Student Information</h1>
              <p className="mt-2 text-gray-600">
                Update information for {selectedStudent.fullName}
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
                <h3 className="text-sm font-medium text-red-800">Error updating student</h3>
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
          initialData={getInitialFormData()}
          isEdit={true}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />

        {/* Help Text */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Update Information</h3>
              <div className="mt-2 text-sm text-green-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>All fields marked with * are required</li>
                  <li>Password changes are not handled through this form</li>
                  <li>Profile picture updates will be reflected immediately</li>
                  <li>Class changes will update the student's academic year</li>
                  <li>Date of birth changes may affect age calculations</li>
                  <li>Contact information updates will be used for communications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStudent;
