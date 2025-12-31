import React, { useState } from 'react';
import TimetableTypeList from '../../components/timetable-type/TimetableTypeList';
import AddTimetableType from './AddTimetableType';
import UpdateTimetableType from './UpdateTimetableType';

type TimetableTypeView = 'list' | 'add' | 'edit';

const TimetableTypeManagement: React.FC = () => {
  const [currentView, setCurrentView] = useState<TimetableTypeView>('list');
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');

  const handleAdd = () => {
    setCurrentView('add');
  };

  const handleEdit = (id: string) => {
    setSelectedTypeId(id);
    setCurrentView('edit');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTypeId('');
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedTypeId('');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return <TimetableTypeList onAdd={handleAdd} onEdit={handleEdit} />;
      case 'add':
        return <AddTimetableType onBack={handleBackToList} onSuccess={handleSuccess} />;
      case 'edit':
        return <UpdateTimetableType typeId={selectedTypeId} onBack={handleBackToList} onSuccess={handleSuccess} />;
      default:
        return <TimetableTypeList onAdd={handleAdd} onEdit={handleEdit} />;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderCurrentView()}</div>;
};

export default TimetableTypeManagement;
