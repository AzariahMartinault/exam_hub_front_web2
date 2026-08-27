import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAvailableExams } from "../../api/myExams";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const ACCENT_COLORS = [
  "bg-blue-500",
  "bg-orange-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-yellow-500",
  "bg-pink-500",
];

function accentFor(id) {
  return ACCENT_COLORS[id % ACCENT_COLORS.length];
}

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

  if (loading) return <p className="text-sm text-gray-500">Chargement...</p>;
  if (error) return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  if (exams.length === 0)
    return <p className="text-sm text-gray-500">Aucun examen disponible pour le moment.</p>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exams.map((exam) => (
        <Card key={exam.id} className="overflow-hidden p-0">
          <div className={`h-1.5 w-full ${accentFor(exam.id)}`} />
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900">{exam.title}</h3>
              <Badge variant="info">{exam.course.code}</Badge>
            </div>

            {exam.description && (
              <p className="line-clamp-2 text-sm text-gray-500">{exam.description}</p>
            )}

            <p className="text-xs text-gray-500">
              {exam.question_count} question(s) · {exam.total_points} point(s)
            </p>
            <p className="text-xs text-gray-500">
              Disponible jusqu'au {formatDate(exam.ends_at)}
            </p>

            <Link
              to={`/student/exams/${exam.id}`}
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Commencer l'examen
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
}