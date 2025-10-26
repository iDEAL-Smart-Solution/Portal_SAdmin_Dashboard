import React, { useState } from 'react';
import StudentList from './StudentList';
import AddStudent from './AddStudent';
import UpdateStudent from './UpdateStudent';
import StudentProfile from '../../components/student/StudentProfile';
import { useStudentStore } from '../../stores/student-store';

type StudentView = 'list' | 'add' | 'edit' | 'profile';

interface StudentManagementProps {
  onBack?: () => void;
}

const StudentManagement: React.FC<StudentManagementProps> = () => {
  const [currentView, setCurrentView] = useState<StudentView>('list');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const { selectedStudent, clearSelectedStudent, fetchStudentById, isLoading, error } = useStudentStore();

  const handleViewProfile = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView('profile');
    fetchStudentById(id);
  };

  const handleEditStudent = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView('edit');
  };

  const handleAddStudent = () => {
    setCurrentView('add');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedStudentId('');
    clearSelectedStudent();
  };

  const handleBackToProfile = () => {
    setCurrentView('profile');
  };

  const handleSuccess = () => {
    setCurrentView('list');
    setSelectedStudentId('');
    clearSelectedStudent();
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (
          <StudentList
            onViewProfile={handleViewProfile}
            onEditStudent={handleEditStudent}
            onAddStudent={handleAddStudent}
          />
        );
      
      case 'add':
        return (
          <AddStudent
            onBack={handleBackToList}
            onSuccess={handleSuccess}
          />
        );
      
      case 'edit':
        return (
          <UpdateStudent
            studentId={selectedStudentId}
            onBack={handleBackToProfile}
            onSuccess={handleSuccess}
          />
        );
      
      case 'profile':
        if (isLoading) {
          return (
            <div className="bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading student profile...</p>
                </div>
              </div>
            </div>
          );
        }

        if (error) {
          return (
            <div className="bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error loading student profile</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={handleBackToList}
                          className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                        >
                          Back to List
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (!selectedStudent) {
          return (
            <div className="bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Student not found</h3>
                  <p className="mt-1 text-sm text-gray-500">The student you're looking for doesn't exist.</p>
                  <div className="mt-6">
                    <button
                      onClick={handleBackToList}
                      className="bg-green-600 px-4 py-2 rounded-md text-sm font-medium text-white hover:bg-green-700"
                    >
                      Back to List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <StudentProfile
                student={selectedStudent}
                onEdit={() => handleEditStudent(selectedStudent.id)}
                onBack={handleBackToList}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <StudentList
            onViewProfile={handleViewProfile}
            onEditStudent={handleEditStudent}
            onAddStudent={handleAddStudent}
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

export default StudentManagement;
