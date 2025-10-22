import React, { useState } from 'react';

type ClassView = 'list' | 'add' | 'edit' | 'profile';

interface ClassManagementProps {
  onBack: () => void;
}

const ClassManagement: React.FC<ClassManagementProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<ClassView>('list');
  const [selectedClassId, setSelectedClassId] = useState<string>('');

  const handleViewProfile = (id: string) => {
    setSelectedClassId(id);
    setCurrentView('profile');
  };

  const handleEditClass = (id: string) => {
    setSelectedClassId(id);
    setCurrentView('edit');
  };

  const handleAddClass = () => {
    setCurrentView('add');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedClassId('');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (
          <ClassList
            onViewProfile={handleViewProfile}
            onEdit={handleEditClass}
            onAddClass={handleAddClass}
          />
        );
      case 'add':
        return (
          <AddClass
            onBack={handleBackToList}
            onSuccess={handleBackToList}
          />
        );
      case 'edit':
        return (
          <EditClass
            classId={selectedClassId}
            onBack={handleBackToList}
            onSuccess={handleBackToList}
          />
        );
      case 'profile':
        return (
          <ClassProfilePage
            classId={selectedClassId}
            onBack={handleBackToList}
            onEdit={handleEditClass}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
};

// Import components here to avoid circular dependencies
import ClassList from '../../components/class/ClassList';
import AddClass from './AddClass';
import EditClass from './EditClass';
import ClassProfilePage from './ClassProfilePage';

export default ClassManagement;
