import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Layers,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  children,
}) => {
  const location = useLocation();
  const activeModule = location.pathname.substring(1) || 'academic';
  // Dynamic page title & description for better clarity
  const pageInfo = {
    staff: {
      title: "Staff Management",
      desc: "Manage staff members and their information",
      icon: <Users className="h-6 w-6 text-blue-600" />,
    },
    student: {
      title: "Student Management",
      desc: "Manage student records and academic information",
      icon: <GraduationCap className="h-6 w-6 text-blue-600" />,
    },
    academic: {
      title: "Academic Data Management",
      desc: "Manage academic sessions, data, and configuration",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
    },
    class: {
      title: "Manage Classes",
      desc: "Create and manage classes, subjects, and student groups",
      icon: <Layers className="h-6 w-6 text-blue-600" />,
    },
    schools: {
      title: "School Management",
      desc: "Manage multiple schools and their settings",
      icon: <Building2 className="h-6 w-6 text-blue-600" />,
    },
  };

  const active = pageInfo[activeModule as keyof typeof pageInfo];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 border-r bg-white shadow-sm">
        <Sidebar activeModule={activeModule} onModuleChange={() => {}} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {active?.icon}
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {active?.title}
                </h1>
                <p className="text-sm text-gray-600 mt-1">{active?.desc}</p>
              </div>
            </div>

            {/* Date Display */}
            <div className="text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
