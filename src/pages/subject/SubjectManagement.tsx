import React, { useState } from 'react';
import SubjectList from '../../components/subject/SubjectList';
import AddSubject from './AddSubject';
import UpdateSubject from './UpdateSubject';
import SubjectProfile from '../../components/subject/SubjectProfile';
import { useSubjectStore } from '../../stores/subject-store';

type SubjectView = 'list' | 'add' | 'edit' | 'profile';

interface SubjectManagementProps {
  onBack?: () => void;
}

const SubjectManagement: React.FC<SubjectManagementProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<SubjectView>('list');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const { selectedSubject, clearSelectedSubject, fetchSubjectById, isLoading, error } = useSubjectStore();

  const handleViewProfile = async (id: string) => {
    setSelectedSubjectId(id);
    setCurrentView('profile');
    // Fetch the subject details for the profile view
    await fetchSubjectById(id);
  };

  const handleEditSubject = (id: string) => {
    setSelectedSubjectId(id);
    setCurrentView('edit');
  };

  const handleAddSubject = () => {
    setCurrentView('add');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedSubjectId('');
    clearSelectedSubject();
  };

  const handleBackToProfile = () => {
    setCurrentView('profile');
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedSubjectId('');
    clearSelectedSubject();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (
          <SubjectList
            onViewProfile={handleViewProfile}
            onEditSubject={handleEditSubject}
            onAddSubject={handleAddSubject}
          />
        );
      
      case 'add':
        return (
          <AddSubject
            onBack={handleBackToList}
            onSuccess={handleSuccess}
          />
        );
      
      case 'edit':
        return (
          <UpdateSubject
            subjectId={selectedSubjectId}
            onBack={handleBackToProfile}
            onSuccess={handleSuccess}
          />
        );
      
      case 'profile':
        if (error) {
          return (
            <div className="bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading profile</h3>
                        <p className="mt-1 text-sm text-red-700">{error}</p>
                        <div className="mt-4">
                          <button
                            onClick={handleBackToList}
                            className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                          >
                            Back to Subject List
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        
        if (isLoading) {
          return (
            <div className="bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading subject profile...</p>
                </div>
              </div>
            </div>
          );
        }
        
        return selectedSubject ? (
          <div className="bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <SubjectProfile
                subject={selectedSubject}
                onEdit={() => handleEditSubject(selectedSubject.id)}
                onBack={handleBackToList}
              />
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 max-w-md mx-auto">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">No profile data</h3>
                      <p className="mt-1 text-sm text-yellow-700">Unable to load subject profile information.</p>
                      <div className="mt-4">
                        <button
                          onClick={handleBackToList}
                          className="bg-yellow-100 px-3 py-2 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-200"
                        >
                          Back to Subject List
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <SubjectList
            onViewProfile={handleViewProfile}
            onEditSubject={handleEditSubject}
            onAddSubject={handleAddSubject}
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

export default SubjectManagement;
