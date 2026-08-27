import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAvailableExams } from "../../api/myExams";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAvailableExams()
      .then(setExams)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (exams.length === 0) return <p>Aucun examen disponible pour le moment.</p>;

  return (
    <div className="exam-grid">
      {exams.map((exam) => (
        <Card key={exam.id} className="exam-card">
          <div className="exam-card-header">
            <h3>{exam.title}</h3>
            <Badge variant="info">{exam.course.code}</Badge>
          </div>
          <p>{exam.description}</p>
          <p className="exam-card-meta">
            {exam.question_count} question(s) · {exam.total_points} point(s)
          </p>
          <p className="exam-card-meta">
            Disponible jusqu'au {formatDate(exam.ends_at)}
          </p>
          <Link to={`/student/exams/${exam.id}`} className="btn btn-primary">
            Commencer l'examen
          </Link>
        </Card>
      ))}
    </div>
  );
}