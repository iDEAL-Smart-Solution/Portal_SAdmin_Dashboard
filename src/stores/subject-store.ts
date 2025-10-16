import { create } from "zustand";

export interface Subject {
  id: string;
  name: string;
  code: string;
  classLevel: string;
  description?: string;
  assignedTeacherId: string;
}

interface SubjectStore {
  subjects: Subject[];
  teacherId: string;
  getAssignedSubjects: () => Subject[];
  getSubjectById: (id: string) => Subject | undefined;
}

export const useSubjectStore = create<SubjectStore>((_set, get) => ({
  teacherId: "TCH123", // Placeholder for logged-in teacher
  subjects: [
    {
      id: "SUBJ1",
      name: "Mathematics",
      code: "MTH101",
      classLevel: "JSS 1",
      description: "Basic algebra, geometry, and arithmetic.",
      assignedTeacherId: "TCH123",
    },
    {
      id: "SUBJ2",
      name: "English Language",
      code: "ENG101",
      classLevel: "JSS 1",
      description: "Grammar, comprehension, and essay writing.",
      assignedTeacherId: "TCH456", // another teacher
    },
    {
      id: "SUBJ3",
      name: "Basic Science",
      code: "BSC101",
      classLevel: "JSS 1",
      description: "Introduction to physical and biological sciences.",
      assignedTeacherId: "TCH123",
    },
  ],

  getAssignedSubjects: () => {
    const { subjects, teacherId } = get();
    return subjects.filter((s) => s.assignedTeacherId === teacherId);
  },

  getSubjectById: (id) => {
    const { subjects } = get();
    return subjects.find((s) => s.id === id);
  },
}));
