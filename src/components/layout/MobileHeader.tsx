import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Layers,
  BookMarked,
} from "lucide-react";

const MobileHeader: React.FC = () => {
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
  };

  const active = pageInfo[activeModule as keyof typeof pageInfo];

  return (
    <div className="md:hidden bg-background-primary border-b border-neutral-200 px-4 py-3 shadow-sm">
      <div className="flex items-center space-x-3">
        {active?.icon}
        <h1 className="text-lg font-semibold text-text-primary">
          {active?.title}
        </h1>
      </div>
    </div>
  );
};

export default MobileHeader;
