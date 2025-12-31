import React, { useEffect, useState } from 'react';
import { useTimetableStore } from '../../stores/timetable-store';
import { UpdateTimeTableTypeRequest } from '../../types/timetable';

interface UpdateTimetableTypeProps {
  typeId: string;
  onBack: () => void;
  onSuccess: () => void;
}

const UpdateTimetableType: React.FC<UpdateTimetableTypeProps> = ({ typeId, onBack, onSuccess }) => {
  const { selectedTimetableType, fetchTimetableTypeById, updateTimetableType, isLoading, error: storeError } = useTimetableStore();
  const [formData, setFormData] = useState<UpdateTimeTableTypeRequest>({
    id: typeId,
    name: '',
    description: '',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTimetableTypeById(typeId);
  }, [typeId, fetchTimetableTypeById]);

  useEffect(() => {
    if (selectedTimetableType) {
      setFormData({
        id: selectedTimetableType.id,
        name: selectedTimetableType.name,
        description: selectedTimetableType.description,
      });
    }
  }, [selectedTimetableType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }

    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    try {
      await updateTimetableType(typeId, formData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update timetable type');
    }
  };

  if (isLoading && !selectedTimetableType) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
            className="text-sm text-indigo-600 hover:text-indigo-500 mb-4"
          >
            ← Back to Timetable Types
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Timetable Type</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update the timetable type information
          </p>
        </div>

        {/* Error Message */}
        {(error || storeError) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error || storeError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Regular Schedule, Exam Period, Holiday Schedule"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Describe the purpose and characteristics of this timetable type"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update Timetable Type'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTimetableType;
