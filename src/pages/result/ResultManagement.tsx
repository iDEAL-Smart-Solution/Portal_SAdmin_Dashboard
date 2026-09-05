import React, { useState } from 'react';
import ResultList from './ResultList';
import UploadResult from './UploadResult';
import BulkUploadResult from './BulkUploadResult';
import ResultApprovalsView from './ResultApprovalsView';

type ResultView = 'list' | 'approvals' | 'upload' | 'bulk-upload';

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

      case 'approvals':
        return (
          <ResultApprovalsView />
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

  const showSubNav = currentView === 'list' || currentView === 'approvals';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {showSubNav && (
        <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
          <button
            type="button"
            onClick={() => setCurrentView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'list'
                ? 'bg-primary-500 text-white shadow-soft font-semibold'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Results Directory
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('approvals')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'approvals'
                ? 'bg-primary-500 text-white shadow-soft font-semibold'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Result Approvals
          </button>
        </div>
      )}
      {renderCurrentView()}
    </div>
  );
};

export default ResultManagement;

