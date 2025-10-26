import React, { useState } from 'react';
import { LoginFormData } from '../../types/auth';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void;
  isLoading?: boolean;
  error?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false, error }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    UIN: '',
    password: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};

    if (!formData.UIN.trim()) {
      newErrors.UIN = 'UIN is required';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* UIN Field */}
        <div>
          <label htmlFor="UIN" className="block text-sm font-medium text-text-secondary mb-2">
            UIN (User Identification Number)
          </label>
          <input
            id="UIN"
            type="text"
            value={formData.UIN}
            onChange={(e) => handleInputChange('UIN', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
              errors.UIN ? 'border-accent-500' : 'border-neutral-300'
            }`}
            placeholder="Enter your UIN"
            disabled={isLoading}
          />
          {errors.UIN && (
            <p className="mt-1 text-sm text-accent-500">{errors.UIN}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                errors.password ? 'border-accent-500' : 'border-neutral-300'
              }`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-accent-500">{errors.password}</p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className={`border rounded-lg p-4 ${
            error.includes('Access denied') 
              ? 'bg-warning-50 border-warning-200' 
              : 'bg-accent-50 border-accent-200'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {error.includes('Access denied') ? (
                  <svg className="h-6 w-6 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-accent-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  error.includes('Access denied') ? 'text-warning-800' : 'text-accent-800'
                }`}>
                  {error.includes('Access denied') ? 'Access Restricted' : 'Login Error'}
                </h3>
                <div className={`mt-1 text-sm ${
                  error.includes('Access denied') ? 'text-warning-700' : 'text-accent-700'
                }`}>
                  <p>{error}</p>
                  {error.includes('Access denied') && (
                    <p className="mt-2 font-medium">
                      Please contact your system administrator for a School Admin account.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-soft text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
