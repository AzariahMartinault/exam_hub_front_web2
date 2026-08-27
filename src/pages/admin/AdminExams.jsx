import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { getExams, createExam, deleteExam } from "../../api/exams";
import { getCourses } from "../../api/courses";

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [examsData, coursesData] = await Promise.all([
        getExams(),
        getCourses(),
      ]);
      setExams(examsData);
      setCourses(coursesData);
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
      await createExam({
        course_id: Number(courseId),
        title,
        description,
        starts_at: startsAt,
        ends_at: endsAt,
      });
      setTitle("");
      setDescription("");
      setCourseId("");
      setStartsAt("");
      setEndsAt("");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteExam(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[var(--color-sidebar)] mb-6">
          Gestion des examens
        </h1>

        {error && (
          <p className="text-sm text-[var(--color-danger)] bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Ajouter un examen
          </h2>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
            <input
              type="text"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <option value="">-- Choisir un cours --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>

            <label className="flex flex-col text-xs text-gray-500 gap-1">
              Début
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </label>

            <label className="flex flex-col text-xs text-gray-500 gap-1">
              Fin
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                required
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </label>

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
                  <th className="px-6 py-3">Titre</th>
                  <th className="px-6 py-3">Cours</th>
                  <th className="px-6 py-3">Questions</th>
                  <th className="px-6 py-3">Tentatives</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="border-t border-gray-100">
                    <td className="px-6 py-3 font-medium">{exam.title}</td>
                    <td className="px-6 py-3 text-gray-500">{exam.course?.code}</td>
                    <td className="px-6 py-3 font-[var(--font-mono)]">{exam.question_count}</td>
                    <td className="px-6 py-3 font-[var(--font-mono)]">{exam.attempt_count}</td>
                    <td className="px-6 py-3 flex gap-3 items-center">
                      <Link
                        to={`/admin/exams/${exam.id}/questions`}
                        className="text-[var(--color-accent)] hover:underline font-medium"
                      >
                        Questions
                      </Link>
                      <Link
                        to={`/admin/exams/${exam.id}/results`}
                        className="text-[var(--color-accent)] hover:underline font-medium"
                      >
                        Résultats
                      </Link>
                      <button
                        onClick={() => handleDelete(exam.id)}
                        className="text-[var(--color-danger)] hover:underline font-medium"
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