import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSubjectStore } from "@/stores/subject-store";
import SubjectDetail from "@/components/subjects/SubjectDetail";

const SubjectDetailPage: React.FC = () => {
  const { id } = useParams();
  const getSubjectById = useSubjectStore((state: { getSubjectById: any; }) => state.getSubjectById);
  const subject = id ? getSubjectById(id) : undefined;

  if (!subject) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Subject not found or not assigned to you.</p>
        <Link to="/subjects" className="text-blue-600 hover:underline mt-2 block">
          ← Back to Subjects
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Link to="/subjects" className="text-blue-600 hover:underline mb-4 block">
        ← Back to Subjects
      </Link>
      <SubjectDetail subject={subject} />
    </div>
  );
};

export default SubjectDetailPage;
