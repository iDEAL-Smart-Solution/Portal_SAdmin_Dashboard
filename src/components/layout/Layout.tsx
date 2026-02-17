import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";
import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    'result': {
      title: "Result Management",
      desc: "Manage student results and performance records",
      icon: <GraduationCap className="h-6 w-6 text-primary-500" />,
    },
    'resource-type': {
      title: "Resource Type Management",
      desc: "Manage resource types for your school",
      icon: <BookOpen className="h-6 w-6 text-primary-500" />,
    },
    'timetable-type': {
      title: "Timetable Type Management",
      desc: "Manage timetable types for scheduling",
      icon: <Layers className="h-6 w-6 text-primary-500" />,
    },
    'timetable': {
      title: "Timetable Management",
      desc: "Create and manage class timetables",
      icon: <Layers className="h-6 w-6 text-primary-500" />,
    },
    'payment-type': {
      title: "Payment Type Management",
      desc: "Manage payment types and categories",
      icon: <BookMarked className="h-6 w-6 text-primary-500" />,
    },
    'payment': {
      title: "Payment Management",
      desc: "Manage payments and transactions",
      icon: <BookMarked className="h-6 w-6 text-primary-500" />,
    },
    'payment-verification': {
      title: "Verify Payment",
      desc: "Verify and review payment records",
      icon: <BookMarked className="h-6 w-6 text-primary-500" />,
    },
    'system-config': {
      title: "System Configuration",
      desc: "Manage system-wide configuration settings",
      icon: <MessageSquare className="h-6 w-6 text-primary-500" />,
    },
  };

  const active = pageInfo[activeModule as keyof typeof pageInfo];

  return (
    <div className="flex h-full bg-background-secondary">
      {/* Sidebar: fixed on desktop, toggleable drawer on mobile */}
      <div>
        {/* Overlay for mobile sidebar */}
        <div
          className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`fixed z-50 top-0 left-0 h-full w-64 bg-background-primary border-r border-neutral-200 shadow-soft transform transition-transform duration-200 md:static md:translate-x-0 md:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-72 md:flex-shrink-0`}
        >
          <Sidebar activeModule={activeModule} onModuleChange={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header with sidebar toggle */}
        <MobileHeader onSidebarToggle={() => setSidebarOpen((v) => !v)} />
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
    </div>
  );
};

export default Layout;
