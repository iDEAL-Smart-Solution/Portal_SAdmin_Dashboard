export interface TimeTableType {
  id: string;
  name: string;
  description: string;
}

export interface TimetableSlot {
  id?: string;
  day: DayOfWeek;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
  classId: string;
  className?: string;
  subjectId: string;
  subjectName?: string;
  staffId: string;
  staffName?: string;
  timeTableTypeId: string;
  timeTableTypeName?: string;
  room?: string;
}

export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export interface DailyTimetableDto {
  day: DayOfWeek;
  slots: TimetableSlotDto[];
}

export interface TimetableSlotDto {
  startTime: string; // Format: "HH:mm:ss"
  endTime: string; // Format: "HH:mm:ss"
  subjectId: string;
  staffId: string;
  room?: string;
}

export interface CreateMultipleTimetableEntriesDto {
  classId: string;
  timeTableTypeId: string;
  dailyTimetables: DailyTimetableDto[];
}

export interface CreateTimetableForOneDayRequest {
  classId: string;
  day: DayOfWeek;
  timeTableTypeId: string;
  slots: TimetableSlotDto[];
}

export interface GetDailyTimetableResponse {
  day: DayOfWeek;
  dayName?: string;
  slots: TimetableSlot[];
}

export interface GetTimetableByClassResponse {
  classId: string;
  className?: string;
  days: GetDailyTimetableResponse[];
}

export interface CreateTimeTableTypeRequest {
  name: string;
  description: string;
}

export interface UpdateTimeTableTypeRequest {
  id: string;
  name: string;
  description: string;
}

export interface GetTimeTableTypeResponse {
  id: string;
  name: string;
  description: string;
}

// For displaying grouped timetables
export interface GroupedTimetable {
  classId: string;
  className: string;
  timetables: TimetableSlot[];
}
