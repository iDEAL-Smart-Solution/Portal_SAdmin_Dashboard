import React from "react";
import { Subject } from "@/stores/subject-store";

interface SubjectDetailProps {
  subject: Subject;
}

const SubjectDetail: React.FC<SubjectDetailProps> = ({ subject }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{subject.name}</h2>
      <p className="text-gray-600">Code: {subject.code}</p>
      <p className="text-gray-600">Class Level: {subject.classLevel}</p>
      <p className="text-gray-700 mt-4">
        {subject.description || "No description available."}
      </p>
    </div>
  );
};

export default SubjectDetail;
