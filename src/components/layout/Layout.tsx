import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeModule, onModuleChange, children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <Sidebar activeModule={activeModule} onModuleChange={onModuleChange} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeModule === 'staff' && 'Staff Management'}
                {activeModule === 'student' && 'Student Management'}
                {activeModule === 'academic' && 'Academic Data Management'}
                {activeModule === 'schools' && 'School Management'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {activeModule === 'staff' && 'Manage staff members and their information'}
                {activeModule === 'student' && 'Manage student records and academic information'}
                {activeModule === 'academic' && 'Manage academic sessions and school branding'}
                {activeModule === 'schools' && 'Manage multiple schools and their settings'}
              </p>
            </div>
            
            {/* Breadcrumb or additional header content can go here */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
