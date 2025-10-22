import React from 'react';
import { useClassStore } from '../../stores/class-store';
import ClassForm from '../../components/class/ClassForm';
import { ClassFormData } from '../../types/class';

interface EditClassProps {
  classId: string;
  onBack: () => void;
  onSuccess: () => void;
}

const EditClass: React.FC<EditClassProps> = ({ classId, onBack, onSuccess }) => {
  const { selectedClass, updateClass, isLoading, error, clearError, fetchClassById } = useClassStore();

  // Fetch class details when component mounts
  React.useEffect(() => {
    fetchClassById(classId);
  }, [classId, fetchClassById]);

  const handleSubmit = async (formData: ClassFormData) => {
    try {
      await updateClass(classId, { 
        id: classId, 
        newName: formData.name 
      });
      onSuccess();
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to update class:', err);
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
              <h1 className="text-2xl font-bold text-gray-900">Edit Class</h1>
              <p className="mt-1 text-sm text-gray-500">
                Update class information
              </p>
            </div>
            <button
              onClick={onBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Classes
            </button>
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
                <h3 className="text-sm font-medium text-red-800">Error updating class</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {selectedClass ? (
          <ClassForm
            initialData={{ name: selectedClass.name }}
            classDetails={selectedClass}
            isEdit={true}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditClass;
