import React, { useState, useEffect } from 'react';
import { useSubjectStore } from '../../stores/subject-store';
import { SubjectFormData } from '../../types/subject';

interface UpdateSubjectProps {
  subjectId: string;
  onBack: () => void;
  onSuccess: () => void;
}

const UpdateSubject: React.FC<UpdateSubjectProps> = ({ subjectId, onBack, onSuccess }) => {
  const { 
    selectedSubject, 
    fetchSubjectById, 
    updateSubject, 
    fetchStaffOptions, 
    fetchClassOptions, 
    staffOptions, 
    classOptions, 
    isLoading, 
    error 
  } = useSubjectStore();
  
  const [formData, setFormData] = useState<SubjectFormData>({
    name: '',
    code: '',
    description: '',
    className: '',
    staffId: ''
  });

  const [validationErrors, setValidationErrors] = useState<Partial<SubjectFormData>>({});

  useEffect(() => {
    fetchSubjectById(subjectId);
    fetchStaffOptions();
    fetchClassOptions();
  }, [subjectId, fetchSubjectById, fetchStaffOptions, fetchClassOptions]);

  useEffect(() => {
    if (selectedSubject) {
      setFormData({
        name: selectedSubject.name,
        code: selectedSubject.code,
        description: selectedSubject.description,
        className: selectedSubject.className,
        staffId: selectedSubject.staffId
      });
    }
  }, [selectedSubject]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name as keyof SubjectFormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<SubjectFormData> = {};

    if (!formData.name.trim()) {
      errors.name = 'Subject name is required';
    }

    if (!formData.code.trim()) {
      errors.code = 'Subject code is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.className.trim()) {
      errors.className = 'Class name is required';
    }

    if (!formData.staffId.trim()) {
      errors.staffId = 'Teacher assignment is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await updateSubject(subjectId, {
        id: subjectId,
        ...formData
      });
      
      onSuccess();
    } catch (error) {
      console.error('Failed to update subject:', error);
    }
  };

  if (isLoading && !selectedSubject) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading subject details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !selectedSubject) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading subject</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <div className="mt-4">
                  <button
                    onClick={onBack}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Update Subject</h1>
              <p className="mt-2 text-gray-600">Edit subject information and assignments</p>
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
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Mathematics, English, Science"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              {/* Subject Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Code *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.code ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., MATH101, ENG201"
                />
                {validationErrors.code && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.code}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Brief description of the subject..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Name */}
              <div>
                <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name *
                </label>
                <select
                  id="className"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.className ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a class</option>
                  {classOptions.map((cls) => (
                    <option key={cls.id} value={cls.name}>
                      {cls.name}
                    </option>
                  ))}
                </select>
                {validationErrors.className && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.className}</p>
                )}
              </div>

              {/* Teacher Assignment */}
              <div>
                <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Teacher *
                </label>
                <select
                  id="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.staffId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a teacher</option>
                  {staffOptions.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.fullName} ({staff.email})
                    </option>
                  ))}
                </select>
                {validationErrors.staffId && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.staffId}</p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Updating...' : 'Update Subject'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSubject;
