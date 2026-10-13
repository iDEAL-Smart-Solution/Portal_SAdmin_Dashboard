import React, { useState } from 'react';
import ResultList from './ResultList';
import ResultApproval from './ResultApproval';
import UploadResult from './UploadResult';
import BulkUploadResult from './BulkUploadResult';

type ResultView = 'list' | 'upload' | 'bulk-upload' | 'approvals';

interface ResultManagementProps {
  onBack?: () => void;
}

const ResultManagement: React.FC<ResultManagementProps> = () => {
  const [currentView, setCurrentView] = useState<ResultView>('list');

  const handleUploadResult = () => {
    setCurrentView('upload');
  };

  const handleBulkUpload = () => {
    setCurrentView('bulk-upload');
  };

  const handleOpenApprovals = () => {
    setCurrentView('approvals');
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
          <ResultList
            onUploadResult={handleUploadResult}
            onBulkUpload={handleBulkUpload}
            onOpenApprovals={handleOpenApprovals}
          />
        );

      case 'approvals':
        return (
          <ResultApproval
            onBack={handleBackToList}
          />
        );
      
      case 'upload':
        return (
          <UploadResult
            onBack={handleBackToList}
            onSuccess={handleSuccess}
          />
        );
      
      case 'bulk-upload':
        return (
          <BulkUploadResult
            onBack={handleBackToList}
            onSuccess={handleSuccess}
          />
        );
      
      default:
        return (
          <ResultList
            onUploadResult={handleUploadResult}
            onBulkUpload={handleBulkUpload}
            onOpenApprovals={handleOpenApprovals}
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

export default ResultManagement;
