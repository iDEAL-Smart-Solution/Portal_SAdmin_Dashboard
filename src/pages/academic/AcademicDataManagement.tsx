import React, { useState } from 'react';
import AcademicDataList from './AcademicDataList';
import AddAcademicSession from './AddAcademicSession';
import UpdateAcademicSession from './UpdateAcademicSession';
import UpdateBranding from './UpdateBranding';

type AcademicView = 'list' | 'add' | 'edit' | 'branding';

interface AcademicDataManagementProps {
  onBack?: () => void;
}

const AcademicDataManagement: React.FC<AcademicDataManagementProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<AcademicView>('list');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  const handleEditSession = () => {
    setCurrentView('edit');
  };

  const handleUpdateBranding = () => {
    setCurrentView('branding');
  };

  const handleAddSession = () => {
    setCurrentView('add');
  };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  const handleSuccess = () => {
    setCurrentView('list');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (
          <AcademicDataList
            onEditSession={handleEditSession}
            onUpdateBranding={handleUpdateBranding}
            onAddSession={handleAddSession}
          />
        );
      
      case 'add':
        return (
          <AddAcademicSession
            onBack={handleBackToList}
            onSuccess={handleSuccess}
          />
        );
      
      case 'edit':
        return (
          <UpdateAcademicSession
            sessionId="current"
            onBack={handleBackToList}
            onSuccess={handleSuccess}
          />
        );
      
      case 'branding':
        return (
          <UpdateBranding
            onBack={handleBackToList}
            onSuccess={handleSuccess}
          />
        );
      
      default:
        return (
          <AcademicDataList
            onEditSession={handleEditSession}
            onUpdateBranding={handleUpdateBranding}
            onAddSession={handleAddSession}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
};

export default AcademicDataManagement;
