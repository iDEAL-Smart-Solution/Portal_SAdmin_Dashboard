import React from "react";
import { useSubjectStore } from "@/stores/subject-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SubjectList: React.FC = () => {
  const assignedSubjects = useSubjectStore((state: { getAssignedSubjects: () => any; }) => state.getAssignedSubjects());

  return (
    <div className="p-6 space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            My Assigned Subjects
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignedSubjects.length === 0 ? (
            <p className="text-gray-500">No subjects assigned to you yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedSubjects.map((subject: { id: any; name: any; code: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; classLevel: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                <Card key={subject.id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">
                      {subject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Code: <span className="font-medium">{subject.code}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Class Level:{" "}
                      <span className="font-medium">{subject.classLevel}</span>
                    </p>
                    <button
                      className="mt-3 text-blue-600 hover:underline text-sm"
                      onClick={() =>
                        alert(`View details for ${subject.name} (placeholder)`)
                      }
                    >
                      View Details →
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SubjectList;
