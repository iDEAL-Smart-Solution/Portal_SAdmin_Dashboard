import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/auth-store';
import { LoginFormData } from '../../types/auth';
import { showError } from '../../lib/notifications';
import axiosInstance, { FileBaseUrl } from '../../lib/axios';
import { applyThemeColor, DEFAULT_PRIMARY_COLOR } from '../../lib/theme';

type SchoolBrand = {
  schoolName?: string;
  schoolLogoFilePath?: string | null;
  colorCode?: string | null;
};

const resolveMediaUrl = (path?: string | null) => {
  if (!path) {
    return '/logo.png';
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${FileBaseUrl}${normalizedPath}`;
};

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, isLoading, error, clearError } = useAuthStore();
  const [uin, setUin] = useState('');
  const [password, setPassword] = useState('');
  const [schoolBrand, setSchoolBrand] = useState<SchoolBrand | null>(null);
  const [isLoadingBrand, setIsLoadingBrand] = useState(true);
  const currentDomain = window.location.hostname;

  useEffect(() => {
    let isActive = true;

    const loadBranding = async () => {
      try {
        applyThemeColor(DEFAULT_PRIMARY_COLOR);

        const response = await axiosInstance.get(`/School/get-public-branding?domain=${encodeURIComponent(currentDomain)}`);
        const branding: SchoolBrand = response.data;

        if (!isActive) {
          return;
        }

        setSchoolBrand(branding);
        applyThemeColor(branding?.colorCode || DEFAULT_PRIMARY_COLOR);
      } catch {
        if (isActive) {
          setSchoolBrand(null);
          applyThemeColor(DEFAULT_PRIMARY_COLOR);
        }
      } finally {
        if (isActive) {
          setIsLoadingBrand(false);
        }
      }
    };

    loadBranding();

    return () => {
      isActive = false;
    };
  }, [currentDomain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const credentials: LoginFormData = {
      UIN: uin,
      password: password,
    };

    const result = await login(credentials);
    if (result.success) {
      onLoginSuccess();
    }
  };

  React.useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const schoolName = schoolBrand?.schoolName || 'School Admin Dashboard';

  return (
    <div className="relative min-h-screen overflow-hidden bg-background-secondary text-text-primary">
      <div className="relative grid h-screen gap-4 lg:grid-cols-[0.98fr_1.02fr] p-4 lg:p-6">
        <section 
          className="relative hidden flex-col justify-end overflow-y-auto rounded-2xl text-slate-800 lg:flex"
          style={{
            backgroundImage: schoolBrand?.schoolLogoFilePath ? `url(${resolveMediaUrl(schoolBrand.schoolLogoFilePath)})` : undefined,
            backgroundColor: schoolBrand?.schoolLogoFilePath ? 'transparent' : '#d1d5db',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: schoolBrand?.schoolLogoFilePath ? '8px 0 24px rgba(2,6,23,0.06)' : undefined,
          }}
        >
          <div className="relative z-10 max-w-xl space-y-6 p-8 xl:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-sm">
              {isLoadingBrand ? 'Loading school branding' : currentDomain}
            </div>
            <div className="space-y-3">
              <p className="text-4xl font-semibold tracking-tight text-slate-900 xl:text-5xl">
                {schoolBrand?.schoolName || 'The easiest way to oversee your school network'}
              </p>
              <p className="max-w-lg text-base leading-7 text-slate-700">
                A clean, branded entry point for school administrators before they sign in.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg space-y-5">
            <div className="surface overflow-hidden p-6 shadow-medium sm:p-8">
              <div className="flex justify-center">
                {schoolBrand?.schoolLogoFilePath ? (
                  <img
                    src={resolveMediaUrl(schoolBrand.schoolLogoFilePath)}
                    alt={schoolName}
                    className="h-14 w-auto object-contain"
                  />
                ) : null}
              </div>

              <div className="mt-6 space-y-1 text-left">
                <h2 className="text-3xl font-semibold tracking-tight text-text-primary">
                  Welcome back,
                </h2>
                <p className="text-3xl font-semibold tracking-tight text-primary-600">
                  We missed you!
                </p>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="uin" className="mb-2 block text-sm font-medium text-text-secondary">
                    UIN
                  </label>
                  <input
                    id="uin"
                    name="uin"
                    type="text"
                    required
                    value={uin}
                    onChange={(e) => setUin(e.target.value)}
                    className="block w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary shadow-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                    placeholder="Enter your UIN"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-medium text-text-secondary">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text-primary shadow-sm outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex justify-end">
                  <button type="button" className="text-sm font-medium text-primary-600 transition hover:text-primary-700">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-primary-500 px-4 py-3 text-sm font-medium text-white shadow-primary transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>

                <div className="space-y-3 pt-1 text-center">
                  <p className="text-sm text-text-secondary">Do not have an account?</p>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm font-medium text-primary-700 transition hover:bg-primary-50"
                  >
                    Create an Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage;
