import { useEffect, useState } from "react";
import { getMyResults } from "../../api/myExams";
import Badge from "../../components/ui/Badge";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function History() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyResults()
      .then(setResults)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Chargement...</p>;
  if (error)
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  if (results.length === 0)
    return <p className="text-sm text-gray-500">Tu n'as encore passé aucun examen.</p>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-3 font-medium">Examen</th>
            <th className="px-4 py-3 font-medium">Cours</th>
            <th className="px-4 py-3 font-medium">Note</th>
            <th className="px-4 py-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {results.map((r) => (
            <tr key={`${r.exam_id}-${r.submitted_at}`} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{r.title}</td>
              <td className="px-4 py-3 text-gray-500">{r.course_code}</td>
              <td className="px-4 py-3">
                <Badge variant={r.score >= r.total_points / 2 ? "success" : "danger"}>
                  {r.score} / {r.total_points}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-500">{formatDate(r.submitted_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}