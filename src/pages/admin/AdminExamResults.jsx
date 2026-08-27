import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Résultats de l'examen : {data?.exam?.title}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <>
          <p>Total des points : {data.total_points}</p>
          <p>Moyenne : {data.average !== null ? data.average : "Aucune tentative"}</p>
          <p>Nombre de tentatives : {data.attempt_count}</p>

          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Note</th>
                <th>Soumis le</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((result) => (
                <tr key={result.student_id}>
                  <td>{result.name}</td>
                  <td>{result.score} / {data.total_points}</td>
                  <td>{new Date(result.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}