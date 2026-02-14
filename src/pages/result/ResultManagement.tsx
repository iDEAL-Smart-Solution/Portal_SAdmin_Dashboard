import React, { useState } from 'react';
import ResultList from './ResultList';
import UploadResult from './UploadResult';
import BulkUploadResult from './BulkUploadResult';

type ResultView = 'list' | 'upload' | 'bulk-upload';

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
