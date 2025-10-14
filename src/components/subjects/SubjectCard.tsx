import React from "react";
import { Subject } from "../../stores/subject-store";
import { Link } from "react-router-dom";

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800">{subject.name}</h3>
      <p className="text-sm text-gray-600">{subject.code}</p>
      <p className="text-sm text-gray-500">{subject.classLevel}</p>
      <Link
        to={`/subjects/${subject.id}`}
        className="text-blue-600 text-sm mt-2 inline-block hover:underline"
      >
        View Details →
      </Link>
    </div>
  );
};

export default SubjectCard;
