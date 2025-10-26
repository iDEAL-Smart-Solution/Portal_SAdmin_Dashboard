// src/pages/academic/classes/ClassListPage.tsx
import { useState } from "react";
import { mockClasses } from "./mockClassData";
import ClassFormModal from "./ClassFormModal";
import { Button } from "../../../components/ui/button";

export default function ClassListPage() {
  const [classes, setClasses] = useState(mockClasses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<{ id: string; name: string } | null>(null);

  const handleCreate = (name: string) => {
    const newClass = {
      id: Date.now().toString(),
      name,
      studentCount: 0,
      subjectCount: 0,
      students: [],
      subjects: [],
    };
    setClasses([...classes, newClass]);
  };

  const handleUpdate = (name: string, id?: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c))
    );
  };

  const handleOpenEdit = (cls: { id: string; name: string }) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Classes</h1>
        <Button 
          onClick={() => { setEditingClass(null); setIsModalOpen(true); }}
          size="sm"
          className="px-3 py-2 text-sm"
        >
          <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="hidden sm:inline">Add Class</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition">
            <h2 className="font-medium text-lg">{cls.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Students: {cls.studentCount} | Subjects: {cls.subjectCount}
            </p>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">View</Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenEdit(cls)}>
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ClassFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(name, id) => editingClass ? handleUpdate(name, id) : handleCreate(name)}
        defaultValue={editingClass?.name}
        classId={editingClass?.id}
      />
    </div>
  );
}
