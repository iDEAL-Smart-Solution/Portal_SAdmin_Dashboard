import React, { useEffect, useState } from 'react';
import { useResourceTypeStore } from '../../stores/resource-type-store';
import { ArrowLeft } from 'lucide-react';

interface UpdateResourceTypeProps {
  resourceTypeId: string;
  onBack: () => void;
  onSuccess: () => void;
}

const UpdateResourceType: React.FC<UpdateResourceTypeProps> = ({ resourceTypeId, onBack, onSuccess }) => {
  const { selectedResourceType, fetchResourceTypeById, updateResourceType, isLoading, error } = useResourceTypeStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (resourceTypeId) {
      fetchResourceTypeById(resourceTypeId);
    }
  }, [resourceTypeId, fetchResourceTypeById]);

  useEffect(() => {
    if (selectedResourceType) {
      setFormData({
        name: selectedResourceType.name,
        description: selectedResourceType.description,
      });
    }
  }, [selectedResourceType]);

  const validate = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    try {
      await updateResourceType(resourceTypeId, { ...formData, id: resourceTypeId });
      onSuccess();
    } catch (error) {
      console.error('Failed to update resource type:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isLoading && !selectedResourceType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Resource Types
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Update Resource Type</h1>
          <p className="mt-2 text-sm text-gray-700">
            Modify the resource type details
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {/* Name */}
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                      validationErrors.name ? 'ring-red-300' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    placeholder="e.g., Documents, Videos, Study Materials"
                  />
                  {validationErrors.name && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.name}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="sm:col-span-6">
                <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                      validationErrors.description ? 'ring-red-300' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    placeholder="Describe what this resource type is for..."
                  />
                  {validationErrors.description && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating...' : 'Update Resource Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateResourceType;
