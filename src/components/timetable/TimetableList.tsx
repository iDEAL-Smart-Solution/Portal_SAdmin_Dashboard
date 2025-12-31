import React, { useEffect, useState } from 'react';
import { useTimetableStore } from '../../stores/timetable-store';
import { Trash2, Edit, Plus, Calendar } from 'lucide-react';

interface TimetableListProps {
  onAdd: () => void;
  onEdit: (classId: string) => void;
}

const TimetableList: React.FC<TimetableListProps> = ({ onAdd, onEdit }) => {
  const { timetables, fetchAllTimetables, deleteTimetableByClass, isLoading, error } = useTimetableStore();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchAllTimetables();
  }, [fetchAllTimetables]);

  const getDayName = (day: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };

  const handleDelete = async (classId: string) => {
    try {
      await deleteTimetableByClass(classId);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete timetable:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Timetables</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage class timetables with schedules for each day of the week
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={onAdd}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Timetable
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Timetable Cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {timetables.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No timetables</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new timetable.</p>
            <div className="mt-6">
              <button
                onClick={onAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Timetable
              </button>
            </div>
          </div>
        ) : (
          timetables.map((timetable) => (
            <div key={timetable.classId} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">{timetable.className}</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(timetable.classId)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    {deleteConfirm === timetable.classId ? (
                      <div className="inline-flex items-center gap-2">
                        <span className="text-xs text-gray-500">Delete?</span>
                        <button
                          onClick={() => handleDelete(timetable.classId)}
                          className="text-red-600 hover:text-red-900 text-xs font-medium"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-gray-600 hover:text-gray-900 text-xs font-medium"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(timetable.classId)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">
                    <p className="font-medium text-gray-700 mb-2">Schedule Overview:</p>
                    {timetable.days.length === 0 ? (
                      <p className="text-gray-400 italic">No schedule configured</p>
                    ) : (
                      <ul className="space-y-1">
                        {timetable.days.map((daily) => (
                          <li key={daily.day} className="flex justify-between">
                            <span className="font-medium">{daily.dayName || getDayName(daily.day)}</span>
                            <span className="text-gray-600">
                              {daily.slots.length} {daily.slots.length === 1 ? 'period' : 'periods'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <button
                  onClick={() => onEdit(timetable.classId)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TimetableList;
