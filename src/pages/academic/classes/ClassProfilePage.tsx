// src/pages/academic/classes/ClassProfilePage.tsx
import { useParams } from "react-router-dom";
import { mockClasses } from "./mockClassData";

export default function ClassProfilePage() {
  const { id } = useParams();
  const cls = mockClasses.find((c) => c.id === id);

  if (!cls) return <p className="p-6">Class not found.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">{cls.name}</h1>
      <section className="mb-6">
        <h2 className="text-lg font-medium mb-2">Students</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cls.students.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white shadow-sm">
              <img src={s.profilePicture} alt={s.name} className="w-10 h-10 rounded-full object-cover" />
              <span>{s.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">Subjects</h2>
        <ul className="list-disc ml-6 text-gray-700">
          {cls.subjects.map((sub) => (
            <li key={sub.id}>
              {sub.name} ({sub.subjectCode})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
