import React from 'react';
import { GetAcademicSessionResponse, Term } from '../../types/academic';

interface CurrentSessionCardProps {
  session: GetAcademicSessionResponse;
  onUpdateSession: () => void;
  onUpdateBranding: () => void;
  onUpdateDates: () => void;
}

const CurrentSessionCard: React.FC<CurrentSessionCardProps> = ({ 
  session, 
  onUpdateSession, 
  onUpdateBranding,
  onUpdateDates
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTermBadgeColor = (term: Term) => {
    switch (term) {
      case Term.first:
        return 'bg-success-100 text-success-800 border-success-200';
      case Term.second:
        return 'bg-primary-100 text-primary-800 border-primary-200';
      case Term.third:
        return 'bg-accent-100 text-accent-800 border-accent-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-primary-500 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {session.SchoolLogoFilePath && (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border-2 border-white flex-shrink-0">
                <img
                  src={session.SchoolLogoFilePath}
                  alt="School Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-white truncate">
                {session.Current_Session}
              </h2>
              <p className="text-primary-100 text-sm truncate">
                {session.SchoolName || 'School Name Not Set'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center flex-shrink-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white whitespace-nowrap">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Active Session
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Current Term */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-text-primary">Current Term</h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTermBadgeColor(session.Current_Term)}`}>
              {session.Current_Term} Term
            </span>
          </div>
          <p className="text-sm text-text-secondary">
            The current academic term for {session.Current_Session} session.
          </p>
        </div>

        {/* Session Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center text-sm text-text-secondary">
            <svg className="w-4 h-4 mr-2 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Academic Session:</span>
            <span className="ml-1">{session.Current_Session}</span>
          </div>

          <div className="flex items-center text-sm text-text-secondary">
            <svg className="w-4 h-4 mr-2 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Created:</span>
            <span className="ml-1">{formatDate(session.CreatedAt)}</span>
          </div>

          <div className="flex items-center text-sm text-text-secondary">
            <svg className="w-4 h-4 mr-2 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Last Updated:</span>
            <span className="ml-1">{formatDate(session.UpdatedAt)}</span>
          </div>

          <div className="flex items-center text-sm text-text-secondary">
            <svg className="w-4 h-4 mr-2 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Status:</span>
            <span className="ml-1 text-success-600 font-medium">Active</span>
          </div>
        </div>

        {/* Term Dates */}
        <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Term Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-error-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-text-secondary">Current Term Ends:</span>
              <span className="ml-2 text-text-primary">
                {session.CurrentTermEndsOn ? formatDate(session.CurrentTermEndsOn) : 'Not set'}
              </span>
            </div>
            
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-2 text-success-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-text-secondary">Next Term Begins:</span>
              <span className="ml-2 text-text-primary">
                {session.NextTermBeginsOn ? formatDate(session.NextTermBeginsOn) : 'Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-3">
            <button
              onClick={onUpdateSession}
              className="inline-flex items-center justify-center px-3 py-2 border border-neutral-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-text-secondary bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full sm:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Update Session
            </button>

            <button
              onClick={onUpdateBranding}
              className="inline-flex items-center justify-center px-3 py-2 border border-neutral-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-text-secondary bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full sm:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Update Branding
            </button>

            <button
              onClick={onUpdateDates}
              className="inline-flex items-center justify-center px-3 py-2 border border-primary-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full sm:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Update Dates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentSessionCard;
