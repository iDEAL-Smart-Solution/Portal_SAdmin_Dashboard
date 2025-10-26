import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MobileBottomNavProps {
  onModuleChange: (module: string) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onModuleChange }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current module from URL
  const currentModule = location.pathname.substring(1) || 'academic';

  const handleModuleChange = (moduleId: string) => {
    navigate(`/${moduleId}`);
    onModuleChange(moduleId);
  };

  const navigationItems = [
    {
      id: 'academic',
      name: 'Academic',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'staff',
      name: 'Staff',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'student',
      name: 'Students',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
    },
    {
      id: 'class',
      name: 'Classes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      id: 'subject',
      name: 'Subjects',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background-primary border-t border-neutral-200 shadow-lg z-50 md:hidden safe-area-pb">
      <div className="flex items-center justify-around py-2 px-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleModuleChange(item.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200 min-h-[60px] min-w-[60px] touch-manipulation ${
              currentModule === item.id
                ? 'text-primary-600 bg-primary-50 scale-105'
                : 'text-neutral-500 active:text-primary-600 active:bg-neutral-50'
            }`}
          >
            <div className={`transition-colors duration-200 ${
              currentModule === item.id ? 'text-primary-600' : 'text-neutral-500'
            }`}>
              {item.icon}
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
