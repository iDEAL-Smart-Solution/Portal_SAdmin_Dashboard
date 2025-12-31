import React, { useEffect, useState } from 'react';
import { useTimetableStore } from '../../stores/timetable-store';
import { useClassStore } from '../../stores/class-store';
import { useSubjectStore } from '../../stores/subject-store';
import { useStaffStore } from '../../stores/staff-store';
import { Trash2, Calendar, Clock } from 'lucide-react';

interface UpdateTimetableProps {
  classId: string;
  onBack: () => void;
  onSuccess: () => void;
}

const UpdateTimetable: React.FC<UpdateTimetableProps> = ({ classId, onBack, onSuccess }) => {
  const {
    selectedTimetable,
    fetchTimetableByClass,
    deleteTimetableByClass,
    fetchTimetableTypes,
    isLoading,
  } = useTimetableStore();
  const { fetchClassList } = useClassStore();
  const { fetchSubjectList } = useSubjectStore();
  const { fetchStaffList } = useStaffStore();

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTimetableByClass(classId);
    fetchClassList();
    fetchSubjectList();
    fetchStaffList();
    fetchTimetableTypes();
  }, [classId]);

  const getDayName = (day: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  const handleDelete = async () => {
    try {
      await deleteTimetableByClass(classId);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete timetable');
    }
  };

  const formatTime = (timeString: string): string => {
    if (!timeString) return '';
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  };

  if (isLoading || !selectedTimetable) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="text-sm text-indigo-600 hover:text-indigo-500 mb-4"
          >
            ← Back to Timetables
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {selectedTimetable.className} - Timetable
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                View and manage the weekly schedule for this class
              </p>
            </div>
            <div className="flex items-center gap-3">
              {deleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Delete entire timetable?</span>
                  <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Timetable
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Timetable View */}
        <div className="space-y-6">
          {!selectedTimetable.days || selectedTimetable.days.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No schedule configured</h3>
              <p className="mt-1 text-sm text-gray-500">
                This timetable doesn't have any periods scheduled yet.
              </p>
            </div>
          ) : (
            selectedTimetable.days.map((daily) => (
              <div key={daily.day} className="bg-white shadow rounded-lg overflow-hidden">
                {/* Day Header */}
                <div className="bg-indigo-600 px-6 py-4">
                  <h3 className="text-lg font-medium text-white">{daily.dayName || getDayName(daily.day)}</h3>
                  <p className="text-sm text-indigo-100">
                    {daily.slots.length} {daily.slots.length === 1 ? 'period' : 'periods'}
                  </p>
                </div>

                {/* Time Slots */}
                <div className="divide-y divide-gray-200">
                  {daily.slots.map((slot, index) => (
                    <div key={slot.id || index} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="font-medium">
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </span>
                            </div>
                            {slot.room && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {slot.room}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <span className="text-xs text-gray-500">Subject:</span>
                              <p className="text-sm font-medium text-gray-900">
                                {slot.subjectName || 'Unknown Subject'}
                              </p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Teacher:</span>
                              <p className="text-sm font-medium text-gray-900">
                                {slot.staffName || 'Unknown Staff'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Editing Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  To modify this timetable, you'll need to delete it and create a new one. 
                  Make sure to note down the current schedule before deleting if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTimetable;
