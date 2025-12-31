import React, { useEffect, useState } from 'react';
import { useTimetableStore } from '../../stores/timetable-store';
import { useClassStore } from '../../stores/class-store';
import { useSubjectStore } from '../../stores/subject-store';
import { useStaffStore } from '../../stores/staff-store';
import {
  DayOfWeek,
  DailyTimetableDto,
  CreateMultipleTimetableEntriesDto,
} from '../../types/timetable';
import { Plus, Trash2 } from 'lucide-react';

interface TimetableFormProps {
  classId?: string;
  onBack: () => void;
  onSuccess: () => void;
}

const DAYS_OF_WEEK = [
  { value: DayOfWeek.Monday, label: 'Monday' },
  { value: DayOfWeek.Tuesday, label: 'Tuesday' },
  { value: DayOfWeek.Wednesday, label: 'Wednesday' },
  { value: DayOfWeek.Thursday, label: 'Thursday' },
  { value: DayOfWeek.Friday, label: 'Friday' },
];

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  staffId: string;
  room: string;
}

interface DaySchedule {
  day: DayOfWeek;
  slots: TimeSlot[];
}

const TimetableForm: React.FC<TimetableFormProps> = ({ classId, onBack, onSuccess }) => {
  const { createTimetable, timetableTypes, fetchTimetableTypes, isLoading } = useTimetableStore();
  const { classList, fetchClassList } = useClassStore();
  const { subjectList, fetchSubjectList } = useSubjectStore();
  const { staffList, fetchStaffList } = useStaffStore();

  const [selectedClassId, setSelectedClassId] = useState<string>(classId || '');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [schedules, setSchedules] = useState<DaySchedule[]>(
    DAYS_OF_WEEK.map(day => ({
      day: day.value,
      slots: [],
    }))
  );
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchClassList();
    fetchSubjectList();
    fetchStaffList();
    fetchTimetableTypes();
  }, []);

  const addSlot = (dayIndex: number) => {
    const newSlot: TimeSlot = {
      id: `${Date.now()}-${Math.random()}`,
      startTime: '08:00',
      endTime: '09:00',
      subjectId: '',
      staffId: '',
      room: '',
    };

    setSchedules(prev => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        slots: [...updated[dayIndex].slots, newSlot],
      };
      return updated;
    });
  };

  const removeSlot = (dayIndex: number, slotId: string) => {
    setSchedules(prev => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        slots: updated[dayIndex].slots.filter(slot => slot.id !== slotId),
      };
      return updated;
    });
  };

  const updateSlot = (dayIndex: number, slotId: string, field: keyof TimeSlot, value: string) => {
    setSchedules(prev => {
      const updated = [...prev];
      updated[dayIndex] = {
        ...updated[dayIndex],
        slots: updated[dayIndex].slots.map(slot =>
          slot.id === slotId ? { ...slot, [field]: value } : slot
        ),
      };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedClassId) {
      setError('Please select a class');
      return;
    }

    if (!selectedTypeId) {
      setError('Please select a timetable type');
      return;
    }

    // Validate that at least one day has slots
    const hasSlots = schedules.some(schedule => schedule.slots.length > 0);
    if (!hasSlots) {
      setError('Please add at least one time slot');
      return;
    }

    // Validate all slots have required fields
    for (const schedule of schedules) {
      for (const slot of schedule.slots) {
        if (!slot.subjectId || !slot.staffId || !slot.startTime || !slot.endTime) {
          setError(`Please fill all fields for ${DAYS_OF_WEEK.find(d => d.value === schedule.day)?.label}`);
          return;
        }

        // Validate time format and logic
        if (slot.startTime >= slot.endTime) {
          setError(`End time must be after start time for ${DAYS_OF_WEEK.find(d => d.value === schedule.day)?.label}`);
          return;
        }
      }
    }

    try {
      const dailyTimetables: DailyTimetableDto[] = schedules
        .filter(schedule => schedule.slots.length > 0)
        .map(schedule => ({
          day: schedule.day,
          slots: schedule.slots.map(slot => ({
            startTime: `${slot.startTime}:00`,
            endTime: `${slot.endTime}:00`,
            subjectId: slot.subjectId,
            staffId: slot.staffId,
            room: slot.room || undefined,
          })),
        }));

      const data: CreateMultipleTimetableEntriesDto = {
        classId: selectedClassId,
        timeTableTypeId: selectedTypeId,
        dailyTimetables,
      };

      await createTimetable(data);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create timetable');
    }
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">Create Timetable</h1>
          <p className="mt-2 text-sm text-gray-700">
            Set up class schedule with subjects, staff, and time slots for each day
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                  Class *
                </label>
                <select
                  id="class"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  disabled={!!classId}
                  required
                >
                  <option value="">Select a class</option>
                  {classList.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Timetable Type *
                </label>
                <select
                  id="type"
                  value={selectedTypeId}
                  onChange={(e) => setSelectedTypeId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a type</option>
                  {timetableTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Daily Schedules */}
          <div className="space-y-6">
            {schedules.map((schedule, dayIndex) => {
              const dayInfo = DAYS_OF_WEEK[dayIndex];
              return (
                <div key={dayInfo.value} className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">{dayInfo.label}</h3>
                    <button
                      type="button"
                      onClick={() => addSlot(dayIndex)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Period
                    </button>
                  </div>

                  {schedule.slots.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No periods scheduled. Click "Add Period" to get started.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {schedule.slots.map((slot, slotIndex) => (
                        <div key={slot.id} className="border border-gray-200 rounded-md p-4">
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                              Period {slotIndex + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeSlot(dayIndex, slot.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Start Time *
                              </label>
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => updateSlot(dayIndex, slot.id, 'startTime', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                End Time *
                              </label>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => updateSlot(dayIndex, slot.id, 'endTime', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                required
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Subject *
                              </label>
                              <select
                                value={slot.subjectId}
                                onChange={(e) => updateSlot(dayIndex, slot.id, 'subjectId', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                required
                              >
                                <option value="">Select</option>
                                {subjectList.map((subject) => (
                                  <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Staff *
                              </label>
                              <select
                                value={slot.staffId}
                                onChange={(e) => updateSlot(dayIndex, slot.id, 'staffId', e.target.value)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                required
                              >
                                <option value="">Select</option>
                                {staffList.map((staff) => (
                                  <option key={staff.id} value={staff.id}>
                                    {staff.fullName}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Room
                              </label>
                              <input
                                type="text"
                                value={slot.room}
                                onChange={(e) => updateSlot(dayIndex, slot.id, 'room', e.target.value)}
                                placeholder="e.g., Room 101"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
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
                  Creating...
                </>
              ) : (
                'Create Timetable'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableForm;
