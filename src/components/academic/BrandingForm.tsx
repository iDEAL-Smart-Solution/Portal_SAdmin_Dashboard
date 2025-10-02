import React, { useState, useEffect } from 'react';
import { BrandingFormData } from '../../types/academic';

interface BrandingFormProps {
  initialData?: Partial<BrandingFormData>;
  onSubmit: (data: BrandingFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const BrandingForm: React.FC<BrandingFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<BrandingFormData>({
    SchoolName: '',
    SchoolLogoFilePath: undefined
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BrandingFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BrandingFormData, string>> = {};

    if (!formData.SchoolName.trim()) {
      newErrors.SchoolName = 'School name is required';
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

  const handleInputChange = (field: keyof BrandingFormData, value: string | File) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ 
          ...prev, 
          SchoolLogoFilePath: 'Please select a valid image file' 
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          SchoolLogoFilePath: 'File size must be less than 5MB' 
        }));
        return;
      }

      handleInputChange('SchoolLogoFilePath', file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Update School Branding
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* School Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Name *
          </label>
          <input
            type="text"
            value={formData.SchoolName}
            onChange={(e) => handleInputChange('SchoolName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
              errors.SchoolName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter school name"
          />
          {errors.SchoolName && (
            <p className="mt-1 text-sm text-red-600">{errors.SchoolName}</p>
          )}
        </div>

        {/* School Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School Logo
          </label>
          <div className="flex items-center space-x-4">
            {formData.SchoolLogoFilePath && (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 border-2 border-gray-300">
                {typeof formData.SchoolLogoFilePath === 'string' ? (
                  <img
                    src={formData.SchoolLogoFilePath}
                    alt="School Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(formData.SchoolLogoFilePath)}
                    alt="School Logo"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                Upload a logo image (PNG, JPG, GIF - max 5MB)
              </p>
              {errors.SchoolLogoFilePath && (
                <p className="mt-1 text-sm text-red-600">{errors.SchoolLogoFilePath}</p>
              )}
            </div>
          </div>
        </div>

        {/* Branding Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Branding Preview</h3>
          <div className="flex items-center space-x-4">
            {formData.SchoolLogoFilePath && (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border-2 border-gray-300">
                {typeof formData.SchoolLogoFilePath === 'string' ? (
                  <img
                    src={formData.SchoolLogoFilePath}
                    alt="School Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(formData.SchoolLogoFilePath)}
                    alt="School Logo"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {formData.SchoolName || 'School Name'}
              </h4>
              <p className="text-sm text-gray-600">Academic Management System</p>
            </div>
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
                Updating...
              </span>
            ) : (
              'Update Branding'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandingForm;
