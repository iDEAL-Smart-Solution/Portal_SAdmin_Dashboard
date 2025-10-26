import React from 'react';
import { GetSingleSubjectResponse } from '../../types/subject';

interface SubjectProfileProps {
  subject: GetSingleSubjectResponse;
  onEdit: () => void;
  onBack: () => void;
}

const SubjectProfile: React.FC<SubjectProfileProps> = ({ subject, onEdit, onBack }) => {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
              <p className="mt-2 text-gray-600">Subject Details</p>
            </div>
            <button
              onClick={onEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Edit Subject
            </button>
          </div>
        </div>

        {/* Subject Information */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Subject Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subject.name}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Subject Code</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                      {subject.code}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subject.description}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned Class</dt>
                    <dd className="mt-1 text-sm text-gray-900">{subject.className}</dd>
                  </div>
                </dl>
              </div>

              {/* Assignment Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Assignment Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Teacher ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                      {subject.staffId}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">School ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                      {subject.schoolId}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Subject ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                      {subject.id}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Description</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{subject.description}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex justify-end space-x-4">
              <button
                onClick={onBack}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Back to List
              </button>
              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Edit Subject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectProfile;
