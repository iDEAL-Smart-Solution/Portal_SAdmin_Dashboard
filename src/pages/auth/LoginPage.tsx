import React from 'react';
import { useAuthStore } from '../../stores/auth-store';
import LoginForm from '../../components/auth/LoginForm';
import { LoginFormData } from '../../types/auth';
import logo from '../../assets/logo.jpg';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (formData: LoginFormData) => {
    try {
      const result = await login(formData);
      if (result.success) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };


  return (
    <div className="min-h-screen bg-background-secondary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Company Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-background-primary shadow-strong border-4 border-background-primary">
            <img
              src={logo}
              alt="iDEAL Smart Solution Limited Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Company Information */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            School Admin Dashboard
          </h1>
          <p className="text-lg text-text-secondary mb-1">
            for iDEAL School Management System
          </p>
          <p className="text-sm text-text-tertiary">
            Powered by iDEAL Smart Solution Limited
          </p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background-primary py-8 px-4 shadow-strong rounded-2xl sm:px-10 border border-neutral-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-text-primary mb-2">
              Sign in to your account
            </h2>
            <p className="text-center text-sm text-text-secondary">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />

          {/* Additional Information */}
          <div className="mt-6 text-center">
            <p className="text-xs text-text-tertiary">
              Secure access to your school management system
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-text-tertiary">
            © 2024 iDEAL Smart Solution Limited. All rights reserved.
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            School Management System v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
