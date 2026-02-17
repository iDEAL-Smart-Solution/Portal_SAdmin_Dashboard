import React from 'react';
import { GetManyStaffResponse } from '../../types/staff';
import { FileBaseUrl } from '../../lib/axios';

interface StaffCardProps {
  staff: GetManyStaffResponse;
  onViewProfile: (id: string) => void;
  onEdit: (id: string) => void;
}

const StaffCard: React.FC<StaffCardProps> = ({ staff, onViewProfile, onEdit }) => {
  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'female':
        return (
          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };


  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-3 sm:p-6 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:space-x-4 space-y-3 sm:space-y-0 w-full">
        {/* Profile Picture */}
        
        <div className="flex-shrink-0">
          {staff.profilePicture ? (
            <img
              src={`${FileBaseUrl}/${staff.profilePicture.startsWith('/') ? staff.profilePicture.slice(1) : staff.profilePicture}`}
              alt={staff.fullName}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Staff Information */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full">
            <div className="w-full">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate break-all whitespace-normal">
                {staff.fullName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate break-all whitespace-normal">
                {staff.email}
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end space-x-2 sm:space-x-0 sm:space-y-2 mt-2 sm:mt-0">
              {getGenderIcon(staff.gender)}
              <span className="text-xs text-gray-500 capitalize">
                {staff.gender}
              </span>
            </div>
          </div>

          <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">UIN:</span>
              <span className="ml-1">{staff.UIN || staff.uin || 'N/A'}</span>
            </div>

            {/* Note: Backend GetManyStaffResponse only includes basic info */}
            {/* Additional details like subjects and join date are available in GetSingleStaffResponse */}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={() => onViewProfile(staff.id)}
          className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="block sm:hidden">View</span>
          <span className="hidden sm:block">View Profile</span>
        </button>
        <button
          onClick={() => onEdit(staff.id)}
          className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-2 border border-transparent text-xs sm:text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>
    </div>
  );
};

export default StaffCard;
