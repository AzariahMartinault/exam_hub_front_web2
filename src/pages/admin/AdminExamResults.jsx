import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { getExamResults } from "../../api/exams";

export default function AdminExamResults() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResults();
  }, [id]);

  async function loadResults() {
    try {
      setLoading(true);
      const result = await getExamResults(id);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <p className="text-sm text-gray-500">Chargement...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[var(--color-sidebar)] mb-6">
          Résultats de l'examen : {data?.exam?.title}
        </h1>

        {error && (
          <p className="text-sm text-[var(--color-danger)] bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {data && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-3xl font-bold text-[var(--color-accent)] font-[var(--font-mono)]">
                  {data.total_points}
                </p>
                <p className="text-sm text-gray-500 mt-1">Points totaux</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-3xl font-bold text-[var(--color-accent)] font-[var(--font-mono)]">
                  {data.average !== null ? data.average : "—"}
                </p>
                <p className="text-sm text-gray-500 mt-1">Moyenne</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-3xl font-bold text-[var(--color-accent)] font-[var(--font-mono)]">
                  {data.attempt_count}
                </p>
                <p className="text-sm text-gray-500 mt-1">Tentatives</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-6 py-3">Étudiant</th>
                    <th className="px-6 py-3">Note</th>
                    <th className="px-6 py-3">Soumis le</th>
                  </tr>
                </thead>
                <tbody>
                  {data.results.map((result) => (
                    <tr key={result.student_id} className="border-t border-gray-100">
                      <td className="px-6 py-3">{result.name}</td>
                      <td className="px-6 py-3 font-[var(--font-mono)] font-medium">
                        {result.score} / {data.total_points}
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {new Date(result.submitted_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}