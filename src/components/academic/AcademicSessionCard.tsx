import React from 'react';
import { GetAcademicSessionResponse } from '../../types/academic';

interface AcademicSessionCardProps {
  session: GetAcademicSessionResponse;
  onEditSession: (id: string) => void;
  onUpdateBranding: (id: string) => void;
  onSetActive: (id: string) => void;
}

const AcademicSessionCard: React.FC<AcademicSessionCardProps> = ({ 
  session, 
  onEditSession, 
  onUpdateBranding,
  onSetActive 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTermBadgeColor = (term: string) => {
    switch (term) {
      case 'First':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'Second':
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'Third':
        return 'bg-accent-100 text-accent-800 border-accent-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border-l-4 ${
      session.IsActive ? 'border-l-primary-500' : 'border-l-neutral-300'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {session.SchoolLogoFilePath && (
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 border-2 border-gray-300">
              <img
                src={session.SchoolLogoFilePath}
                alt="School Logo"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {session.Current_Session}
            </h3>
            <p className="text-sm text-gray-600">
              {session.SchoolName || 'School Name Not Set'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {session.IsActive && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Active
            </span>
          )}
        </div>
      </div>

      {/* Session Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Current Term:</span>
          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTermBadgeColor(session.Current_Term)}`}>
            {session.Current_Term} Term
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Created:</span>
          <span className="ml-1">{formatDate(session.CreatedAt)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Last Updated:</span>
          <span className="ml-1">{formatDate(session.UpdatedAt)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="flex space-x-2">
          <button
            onClick={() => onEditSession(session.Id)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Session
          </button>
          
          <button
            onClick={() => onUpdateBranding(session.Id)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Update Branding
          </button>
        </div>

        {!session.IsActive && (
          <button
            onClick={() => onSetActive(session.Id)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Set Active
          </button>
        )}
      </div>
    </div>
  );
};

export default AcademicSessionCard;
