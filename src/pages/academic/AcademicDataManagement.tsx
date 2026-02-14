import React, { useState } from 'react';
import AcademicDataList from './AcademicDataList';
import UpdateAcademicSession from './UpdateAcademicSession';
import UpdateBranding from './UpdateBranding';
import UpdateSessionDates from './UpdateSessionDates';

type AcademicView = 'list' | 'edit' | 'branding' | 'dates';

interface AcademicDataManagementProps {
  onBack?: () => void;
}

const AcademicDataManagement: React.FC<AcademicDataManagementProps> = () => {
  const [currentView, setCurrentView] = useState<AcademicView>('list');

  const handleEditSession = () => {
    setCurrentView('edit');
  };

  const handleUpdateBranding = () => {
    setCurrentView('branding');
  };

  const handleUpdateDates = () => {
    setCurrentView('dates');
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
            onUpdateDates={handleUpdateDates}
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
      
      case 'dates':
        return (
          <UpdateSessionDates
            sessionId="current"
            onBack={handleBackToList}
            onSuccess={handleSuccess}
          />
        );
      
      default:
        return (
          <AcademicDataList
            onEditSession={handleEditSession}
            onUpdateBranding={handleUpdateBranding}
            onUpdateDates={handleUpdateDates}
          />
        );
    }
  };

  return (
    <div className="bg-gray-50">
      {renderCurrentView()}
    </div>
  );
};

export default AcademicDataManagement;
