import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth-store';
import logo from '../../assets/logo.jpg';

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current module from URL
  const currentModule = location.pathname.substring(1) || 'academic';

  const handleModuleChange = (moduleId: string) => {
    navigate(`/${moduleId}`);
  };

  const navigationItems = [
    {
      id: 'academic',
      name: 'Academic Data',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: 'Manage academic sessions and branding',
      disabled: false
    },
    {
      id: 'staff',
      name: 'Manage Staff',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      description: 'Add, edit, and manage staff members',
      disabled: false
    },
    {
      id: 'student',
      name: 'Manage Students',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      description: 'Add, edit, and manage student records',
      disabled: false
    },
    {
      id: 'class',
      name: 'Manage Classes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: 'Create and manage classes',
      disabled: false
    },
    {
      id: 'subject',
      name: 'Manage Subjects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 011.414.414l5.586 5.586a1 1 0 01.414 1.414V19a2 2 0 01-2 2z" />
        </svg>
      ),
      description: 'Create and manage subjects',
      disabled: false
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-full bg-background-primary">
      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-neutral-200 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100">
            <img
              src={logo}
              alt="iDEAL Smart Solution Limited Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold text-text-primary">School Admin</h1>
            <p className="text-xs text-text-tertiary">iDEAL System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => !item.disabled && handleModuleChange(item.id)}
            disabled={item.disabled}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentModule === item.id
                ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-soft'
                : item.disabled
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-text-secondary hover:bg-neutral-50'
            }`}
          >
            <div className={`flex-shrink-0 ${
              currentModule === item.id ? 'text-primary-500' : 'text-neutral-500'
            }`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${
                item.disabled ? 'text-neutral-400' : ''
              }`}>
                {item.name}
              </p>
              <p className={`text-xs hidden lg:block ${
                item.disabled ? 'text-neutral-400' : 'text-text-tertiary'
              }`}>
                {item.description}
              </p>
            </div>
            {item.disabled && (
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500">
                  Soon
                </span>
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200 flex-shrink-0">
        <div className="text-center mb-4">
          <p className="text-xs text-text-tertiary">
            Powered by iDEAL Smart Solution Limited
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-accent-500 hover:bg-accent-50 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
