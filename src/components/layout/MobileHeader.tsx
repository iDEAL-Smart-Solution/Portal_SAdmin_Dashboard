import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  BookMarked,
  FileText,
  Calendar,
  ClipboardCheck,
  CreditCard,
  Settings,
} from "lucide-react";

interface MobileHeaderProps {
  onSidebarToggle?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ onSidebarToggle }) => {
  const location = useLocation();
  const activeModule = location.pathname.substring(1) || 'academic';

  const pageInfo = {
    staff: {
      title: "Staff Management",
      icon: <Users className="h-5 w-5 text-primary-500" />,
    },
    student: {
      title: "Student Management",
      icon: <GraduationCap className="h-5 w-5 text-primary-500" />,
    },
    academic: {
      title: "Academic Data",
      icon: <BookOpen className="h-5 w-5 text-primary-500" />,
    },
    class: {
      title: "Manage Classes",
      icon: <Layers className="h-5 w-5 text-primary-500" />,
    },
    subject: {
      title: "Subject Management",
      icon: <BookMarked className="h-5 w-5 text-primary-500" />,
    },
    result: {
      title: "Result Management",
      icon: <FileText className="h-5 w-5 text-primary-500" />,
    },
    'remark-templates': {
      title: "Remark Templates",
      icon: <ClipboardCheck className="h-5 w-5 text-primary-500" />,
    },
    'resource-type': {
      title: "Resource Types",
      icon: <FileText className="h-5 w-5 text-primary-500" />,
    },
    'timetable-type': {
      title: "Timetable Types",
      icon: <Calendar className="h-5 w-5 text-primary-500" />,
    },
    timetable: {
      title: "Timetables",
      icon: <Calendar className="h-5 w-5 text-primary-500" />,
    },
    payment: {
      title: "Payments",
      icon: <CreditCard className="h-5 w-5 text-primary-500" />,
    },
    'payment-type': {
      title: "Payment Types",
      icon: <CreditCard className="h-5 w-5 text-primary-500" />,
    },
    'payment-verification': {
      title: "Verify Payments",
      icon: <ClipboardCheck className="h-5 w-5 text-primary-500" />,
    },
    'system-config': {
      title: "System Config",
      icon: <Settings className="h-5 w-5 text-primary-500" />,
    },
  };

  const active = pageInfo[activeModule as keyof typeof pageInfo];

  return (
    <div className="md:hidden bg-background-primary border-b border-neutral-200 px-4 py-3 shadow-sm">
      <div className="flex items-center space-x-3">
        {/* Sidebar toggle button */}
        {onSidebarToggle && (
          <button
            onClick={onSidebarToggle}
            className="mr-2 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        {active?.icon}
        <h1 className="text-lg font-semibold text-text-primary">
          {active?.title}
        </h1>
      </div>
    </div>
  );
};

export default MobileHeader;
