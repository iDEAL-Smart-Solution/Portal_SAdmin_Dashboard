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

const StudentManagement: React.FC<StudentManagementProps> = ({ onBack }) => {
  const [currentView, setCurrentView] = useState<StudentView>('list');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const { selectedStudent, clearSelectedStudent } = useStudentStore();

  const handleViewProfile = (id: string) => {
    setSelectedStudentId(id);
    setCurrentView('profile');
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
        return selectedStudent ? (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <StudentProfile
                student={selectedStudent}
                onEdit={() => handleEditStudent(selectedStudent.id)}
                onBack={handleBackToList}
              />
            </div>
          </div>
        ) : (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading student profile...</p>
              </div>
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
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
    </div>
  );
};

export default StudentManagement;
