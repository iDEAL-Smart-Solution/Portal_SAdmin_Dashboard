import React, { useState, useEffect } from 'react';
import { AcademicSessionFormData, Term } from '../../types/academic';

interface AcademicSessionFormProps {
  initialData?: Partial<AcademicSessionFormData>;
  isEdit?: boolean;
  onSubmit: (data: AcademicSessionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AcademicSessionForm: React.FC<AcademicSessionFormProps> = ({
  initialData,
  isEdit = false,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<AcademicSessionFormData>({
    Current_Session: '',
    Current_Term: Term.first,
    NextTermBeginsOn: '',
    CurrentTermEndsOn: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AcademicSessionFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AcademicSessionFormData, string>> = {};

    if (!formData.Current_Session.trim()) {
      newErrors.Current_Session = 'Academic session is required';
    } else if (!/^\d{4}\/\d{4}$/.test(formData.Current_Session.trim())) {
      newErrors.Current_Session = 'Please enter session in format YYYY/YYYY (e.g., 2025/2026)';
    }

    if (!formData.Current_Term) {
      newErrors.Current_Term = 'Current term is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof AcademicSessionFormData, value: string | Term) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getTermOptions = () => {
    return Object.values(Term).map(term => ({
      value: term,
      label: `${term} Term`
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isEdit ? 'Update Academic Session' : 'Add New Academic Session'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Academic Session */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Session *
          </label>
          <input
            type="text"
            value={formData.Current_Session}
            onChange={(e) => handleInputChange('Current_Session', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.Current_Session ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., 2025/2026"
          />
          {errors.Current_Session && (
            <p className="mt-1 text-sm text-red-600">{errors.Current_Session}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Enter the academic session in the format YYYY/YYYY
          </p>
        </div>

        {/* Current Term */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Term *
          </label>
          <select
            value={formData.Current_Term}
            onChange={(e) => handleInputChange('Current_Term', e.target.value as Term)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.Current_Term ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {getTermOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.Current_Term && (
            <p className="mt-1 text-sm text-red-600">{errors.Current_Term}</p>
          )}
        </div>
        {/* Current Term Ends On */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Term Ends On
          </label>
          <input
            type="date"
            value={formData.CurrentTermEndsOn || ''}
            onChange={(e) => handleInputChange('CurrentTermEndsOn', e.target.value)}
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
            value={formData.NextTermBeginsOn || ''}
            onChange={(e) => handleInputChange('NextTermBeginsOn', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            When does the next term begin?
          </p>
        </div>
        {/* Session Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Session Preview</h3>
          <div className="text-sm text-gray-600">
            <p><span className="font-medium">Academic Session:</span> {formData.Current_Session || 'Not specified'}</p>
            <p><span className="font-medium">Current Term:</span> {formData.Current_Term} Term</p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
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
                {isEdit ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              isEdit ? 'Update Session' : 'Create Session'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AcademicSessionForm;
