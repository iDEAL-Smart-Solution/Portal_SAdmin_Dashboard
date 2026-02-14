import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import MobileHeader from "./MobileHeader";
import {
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  BookMarked,
  MessageSquare,
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
      icon: <Users className="h-6 w-6 text-primary-500" />,
    },
    student: {
      title: "Student Management",
      desc: "Manage student records and academic information",
      icon: <GraduationCap className="h-6 w-6 text-primary-500" />,
    },
    academic: {
      title: "Academic Data Management",
      desc: "Manage academic sessions, data, and configuration",
      icon: <BookOpen className="h-6 w-6 text-primary-500" />,
    },
    class: {
      title: "Manage Classes",
      desc: "Create and manage classes, subjects, and student groups",
      icon: <Layers className="h-6 w-6 text-primary-500" />,
    },
    subject: {
      title: "Subject Management",
      desc: "Create and manage subjects and assignments",
      icon: <BookMarked className="h-6 w-6 text-primary-500" />,
    },
    'remark-templates': {
      title: "Remark Templates",
      desc: "Manage principal remark templates for report cards",
      icon: <MessageSquare className="h-6 w-6 text-primary-500" />,
    },
  };

  const active = pageInfo[activeModule as keyof typeof pageInfo];

  return (
    <div className="flex h-full bg-background-secondary">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block w-72 flex-shrink-0 border-r border-neutral-200 bg-background-primary shadow-soft h-full">
        <Sidebar activeModule={activeModule} onModuleChange={() => {}} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <MobileHeader />
        
        {/* Desktop Header */}
        <header className="hidden md:block bg-background-primary border-b border-neutral-200 px-6 py-4 shadow-soft flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {active?.icon}
              <div>
                <h1 className="text-2xl font-semibold text-text-primary">
                  {active?.title}
                </h1>
                <p className="text-sm text-text-secondary mt-1">{active?.desc}</p>
              </div>
            </div>

            {/* Date Display */}
            <div className="text-sm text-text-tertiary">
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
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background-secondary pb-20 md:pb-6">{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onModuleChange={() => {}} />
    </div>
  );
};

export default Layout;
