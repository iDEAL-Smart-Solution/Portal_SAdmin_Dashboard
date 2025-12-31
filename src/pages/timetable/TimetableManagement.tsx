import React, { useState } from 'react';
import TimetableList from '../../components/timetable/TimetableList';
import AddTimetable from './AddTimetable.tsx';
import UpdateTimetable from './UpdateTimetable.tsx';

type TimetableView = 'list' | 'add' | 'edit';

const TimetableManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<TimetableView>('list');
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const handleAdd = () => {
    setCurrentView('add');
  };

  const handleEdit = (classId: string) => {
    setSelectedClassId(classId);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedClassId('');
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedClassId('');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return <TimetableList onAdd={handleAdd} onEdit={handleEdit} />;
      case 'add':
        return <AddTimetable onBack={handleBackToList} onSuccess={handleSuccess} />;
      case 'edit':
        return <UpdateTimetable classId={selectedClassId} onBack={handleBackToList} onSuccess={handleSuccess} />;
      default:
        return <TimetableList onAdd={handleAdd} onEdit={handleEdit} />;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderCurrentView()}</div>;
};

export default TimetableManagement;
