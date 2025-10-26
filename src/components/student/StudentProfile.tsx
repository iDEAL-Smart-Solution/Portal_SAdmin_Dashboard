import React from 'react';
import { GetSingleStudentResponse } from '../../types/student';

interface StudentProfileProps {
  student: GetSingleStudentResponse;
  onEdit: () => void;
  onBack: () => void;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student, onEdit, onBack }) => {
  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return (
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'female':
        return (
          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getClassBadgeColor = (className: string) => {
    if (className.includes('Grade 9')) return 'bg-success-100 text-success-800 border-success-200';
    if (className.includes('Grade 10')) return 'bg-primary-100 text-primary-800 border-primary-200';
    if (className.includes('Grade 11')) return 'bg-warning-100 text-warning-800 border-warning-200';
    if (className.includes('Grade 12')) return 'bg-accent-100 text-accent-800 border-accent-200';
    return 'bg-neutral-100 text-neutral-800 border-neutral-200';
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="bg-primary-500 px-6 py-8 rounded-t-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center text-white hover:text-primary-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Student List
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Update Profile
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Profile Header */}
        <div className="flex items-start space-x-6 mb-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {student.profilePicture ? (
              <img
                src={student.profilePicture}
                alt={student.fullName}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{student.fullName}</h1>
              {getGenderIcon(student.gender)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>{student.email}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>{student.phoneNumber}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">UIN:</span>
                <span className="ml-2">{student.UIN}</span>
              </div>
              
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Class:</span>
                <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getClassBadgeColor(student.className)}`}>
                  {student.className}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <p className="text-gray-900">{student.fullName}</p>
              </div>
              
              {student.middleName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                  <p className="text-gray-900">{student.middleName}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900 capitalize">{student.gender}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <p className="text-gray-900">{formatDate(student.dateOfBirth)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <p className="text-gray-900">{calculateAge(student.dateOfBirth)} years old</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p className="text-gray-900">{student.address}</p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Academic Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student UIN</label>
                <p className="text-gray-900 font-mono">{student.UIN}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Class</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getClassBadgeColor(student.className)}`}>
                  {student.className}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <p className="text-gray-900">{student.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-900">{student.phoneNumber}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Date</label>
                <p className="text-gray-900">{formatDate(student.createdAt)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                <p className="text-gray-900">{formatDate(student.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{calculateAge(student.dateOfBirth)}</div>
              <div className="text-sm text-gray-600">Years Old</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{student.className}</div>
              <div className="text-sm text-gray-600">Current Class</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{student.UIN}</div>
              <div className="text-sm text-gray-600">Student ID</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
