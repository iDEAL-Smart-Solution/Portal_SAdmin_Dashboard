import React, { useState, useEffect } from 'react';
import { Eye, Edit3 } from 'lucide-react';
import { useSubjectStore } from '../../stores/subject-store';

interface SubjectListProps {
  onViewProfile: (id: string) => void;
  onEditSubject: (id: string) => void;
  onAddSubject: () => void;
}

const SubjectList: React.FC<SubjectListProps> = ({
  onViewProfile,
  onEditSubject,
  onAddSubject
}) => {
  const { subjectList, isLoading, error, fetchSubjectList, clearError } = useSubjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'name' | 'code'>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    fetchSubjectList();
  }, [fetchSubjectList]);

  const handleSearch = () => {
    if (filterBy === 'name') {
      fetchSubjectList();
    } else if (filterBy === 'code') {
      fetchSubjectList();
    } else {
      fetchSubjectList();
    }
  };

  const filteredSubjects = subjectList.filter(subject => {
    if (!searchTerm) return true;
    
    switch (filterBy) {
      case 'name':
        return subject.name.toLowerCase().includes(searchTerm.toLowerCase());
      case 'code':
        return subject.code.toLowerCase().includes(searchTerm.toLowerCase());
      default:
        return subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  if (isLoading) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading subjects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading subjects</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      clearError();
                      fetchSubjectList();
                    }}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
              <p className="mt-2 text-gray-600">Manage school subjects and assignments</p>
            </div>
            <button
              onClick={onAddSubject}
              className="inline-flex items-center px-3 py-2 sm:px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="hidden sm:inline">Add Subject</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Search and Filter (Collapsible) */}
        <div className="bg-white rounded-lg shadow mb-6">
          <button
            className="w-full flex items-center justify-between px-6 py-3 focus:outline-none hover:bg-gray-50 transition"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
          >
            <span className="font-medium text-gray-800">Search & Filter</span>
            <svg
              className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {filtersOpen && (
            <div className="p-6 pt-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value as 'all' | 'name' | 'code')}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Fields</option>
                    <option value="name">Name</option>
                    <option value="code">Code</option>
                  </select>
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subjects Table */}
        {filteredSubjects.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{subject.name}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">{subject.code}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">{subject.className}</td>
                      <td className="px-4 py-4 text-sm text-gray-700 whitespace-nowrap">{subject.staffName || 'Not assigned'}</td>
                      <td className="px-4 py-4 text-sm text-gray-600 max-w-xs truncate" title={subject.description || '-'}>
                        {subject.description || '-'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onViewProfile(subject.id)}
                            className="inline-flex items-center p-1 text-blue-600 hover:text-blue-700"
                            title="View Subject"
                            aria-label="View Subject"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditSubject(subject.id)}
                            className="inline-flex items-center p-1 text-gray-600 hover:text-gray-700"
                            title="Edit Subject"
                            aria-label="Edit Subject"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.414l5.586 5.586a1 1 0 01.414 1.414V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No subjects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating a new subject.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={onAddSubject}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Add Subject
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectList;
