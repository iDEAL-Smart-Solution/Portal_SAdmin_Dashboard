import React from 'react';
import { Term } from '../../types/academic';

interface TermSelectorProps {
  currentTerm: Term;
  onTermChange: (term: Term) => void;
  isLoading?: boolean;
}

const TermSelector: React.FC<TermSelectorProps> = ({ 
  currentTerm, 
  onTermChange, 
  isLoading = false 
}) => {
  const getTermOptions = () => {
    return Object.values(Term).map(term => ({
      value: term,
      label: `${term} Term`
    }));
  };

  const getTermBadgeColor = (term: Term) => {
    switch (term) {
      case Term.first:
        return 'bg-green-100 text-green-800 border-green-200';
      case Term.second:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case Term.third:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Current Term</h3>
          <p className="text-sm text-gray-600">Select the current academic term</p>
        </div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTermBadgeColor(currentTerm)}`}>
          {currentTerm} Term
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {getTermOptions().map((option) => (
          <button
            key={option.value}
            onClick={() => onTermChange(option.value)}
            disabled={isLoading}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              currentTerm === option.value
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-sm font-medium">{option.label}</div>
            {currentTerm === option.value && (
              <div className="mt-1 text-xs text-primary-600">Current</div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-primary-50 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-primary-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-primary-700">
              <strong>Note:</strong> Changing the term will update the current academic session. 
              Only one term can be active at a time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermSelector;
