// src/pages/academic/classes/ClassFormModal.tsx
import { useState, useEffect } from "react";
import Modal from "../../../components/ui/modal";
import { Button } from "../../../components/ui/button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, id?: string) => void;
  defaultValue?: string;
  classId?: string;
}

export default function ClassFormModal({
  isOpen,
  onClose,
  onSave,
  defaultValue = "",
  classId,
}: Props) {
  const [name, setName] = useState(defaultValue);

  useEffect(() => {
    setName(defaultValue);
  }, [defaultValue, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave(name.trim(), classId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={classId ? "Update Class" : "Create New Class"}
      size="sm"
      closeOnOverlayClick={true}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{classId ? "Update" : "Create"}</Button>
        </div>
      }
    >
      <label className="block text-sm text-gray-600 mb-2">Class Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter class name"
        className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
        autoFocus
      />
      {/* hidden id (if you want to display) */}
      {classId && (
        <input type="hidden" value={classId} readOnly />
      )}
    </Modal>
  );
}
