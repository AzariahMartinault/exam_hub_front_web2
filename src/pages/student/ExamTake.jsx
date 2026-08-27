import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamDetail, submitExam } from "../../api/myExams";
import ExamResult from "./ExamResult";
import Button from "../../components/ui/Button";

export default function ExamTake() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getExamDetail(id)
      .then(setExam)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  function selectChoice(questionId, choiceId) {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const payload = Object.entries(answers).map(([question_id, choice_id]) => ({
        question_id: Number(question_id),
        choice_id,
      }));
      const res = await submitExam(id, payload);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Chargement...</p>;
  if (error && !exam)
    return <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>;
  if (result) return <ExamResult exam={exam} result={result} />;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">{exam.title}</h2>
        {exam.description && <p className="mt-1 text-sm text-gray-500">{exam.description}</p>}
      </div>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="flex flex-col gap-4">
        {exam.questions.map((q, index) => (
          <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="mb-3 font-medium text-gray-900">
              {index + 1}. {q.statement}{" "}
              <span className="text-xs font-normal text-gray-500">
                ({q.points} pt{q.points > 1 ? "s" : ""})
              </span>
            </p>
            <div className="flex flex-col gap-2">
              {q.choices.map((choice) => (
                <label
                  key={choice.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50"
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={answers[q.id] === choice.id}
                    onChange={() => selectChoice(q.id, choice.id)}
                    className="h-4 w-4"
                  />
                  {choice.text}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={() => setConfirmOpen(true)} disabled={submitting}>
          Soumettre l'examen
        </Button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <p className="mb-4 text-sm text-gray-700">
              Tu as répondu à {Object.keys(answers).length} question(s) sur{" "}
              {exam.questions.length}. Une fois soumis, tu ne pourras plus modifier tes réponses.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Envoi..." : "Confirmer"}
              </Button>
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}