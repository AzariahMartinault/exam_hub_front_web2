import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { getCourses, createCourse, deleteCourse } from "../../api/courses";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await createCourse({ code, name, description });
      setCode("");
      setName("");
      setDescription("");
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[var(--color-sidebar)] mb-6">
          Gestion des cours
        </h1>

        {error && (
          <p className="text-sm text-[var(--color-danger)] bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Ajouter un cours
          </h2>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
            <input
              type="text"
              placeholder="Code (ex: PROG2)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <input
              type="text"
              placeholder="Nom du cours"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <button
              type="submit"
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
            >
              Créer
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-gray-500">Chargement...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Nom</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Examens</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-t border-gray-100">
                    <td className="px-6 py-3 font-medium">{course.code}</td>
                    <td className="px-6 py-3">{course.name}</td>
                    <td className="px-6 py-3 text-gray-500">{course.description}</td>
                    <td className="px-6 py-3 font-[var(--font-mono)]">{course.exam_count}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="text-[var(--color-danger)] hover:underline text-sm font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}