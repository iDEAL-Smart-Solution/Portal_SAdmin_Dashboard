import React, { useState } from 'react';
import StaffList from './StaffList';
import AddStaff from './AddStaff';
import UpdateStaff from './UpdateStaff';
import StaffProfile from '../../components/staff/StaffProfile';
import { useStaffStore } from '../../stores/staff-store';

type StaffView = 'list' | 'add' | 'edit' | 'profile';

interface StaffManagementProps {
  onBack?: () => void;
}

const StaffManagement: React.FC<StaffManagementProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<StaffView>('list');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const { selectedStaff, clearSelectedStaff } = useStaffStore();

  const handleViewProfile = (id: string) => {
    setSelectedStaffId(id);
    setCurrentView('profile');
  };

  const handleEditStaff = (id: string) => {
    setSelectedStaffId(id);
    setCurrentView('edit');
  };

  const handleAddStaff = () => {
    setCurrentView('add');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedStaffId('');
    clearSelectedStaff();
  };

  const handleBackToProfile = () => {
    setCurrentView('profile');
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedStaffId('');
    clearSelectedStaff();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (
          <StaffList
            onViewProfile={handleViewProfile}
            onEditStaff={handleEditStaff}
            onAddStaff={handleAddStaff}
          />
        );
      
      case 'add':
        return (
          <AddStaff
            onBack={handleBackToList}
            onSuccess={handleSuccess}
          />
        );
      
      case 'edit':
        return (
          <UpdateStaff
            staffId={selectedStaffId}
            onBack={handleBackToProfile}
            onSuccess={handleSuccess}
          />
        );
      
      case 'profile':
        return selectedStaff ? (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <StaffProfile
                staff={selectedStaff}
                onEdit={() => handleEditStaff(selectedStaff.id)}
                onBack={handleBackToList}
              />
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading staff profile...</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <StaffList
            onViewProfile={handleViewProfile}
            onEditStaff={handleEditStaff}
            onAddStaff={handleAddStaff}
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

export default StaffManagement;
