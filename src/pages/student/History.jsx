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

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (results.length === 0) return <p>Tu n'as encore passé aucun examen.</p>;

  return (
    <table className="results-table">
      <thead>
        <tr>
          <th>Examen</th>
          <th>Cours</th>
          <th>Note</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {results.map((r) => (
          <tr key={`${r.exam_id}-${r.submitted_at}`}>
            <td>{r.title}</td>
            <td>{r.course_code}</td>
            <td>
              <Badge variant={r.score >= r.total_points / 2 ? "success" : "danger"}>
                {r.score} / {r.total_points}
              </Badge>
            </td>
            <td>{formatDate(r.submitted_at)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}