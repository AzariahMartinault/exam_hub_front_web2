import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamDetail, submitExam } from "../../api/myExams";
import ExamResult from "./ExamResult";
import Button from "../../components/ui/Button";

export default function ExamTake() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({}); // { question_id: choice_id }
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

  if (loading) return <p>Chargement...</p>;
  if (error && !exam) return <p className="error-message">{error}</p>;
  if (result) return <ExamResult exam={exam} result={result} />;

  return (
    <div className="exam-take">
      <h2>{exam.title}</h2>
      <p>{exam.description}</p>
      {error && <p className="error-message">{error}</p>}

      {exam.questions.map((q, index) => (
        <div key={q.id} className="question-block">
          <p className="question-statement">
            {index + 1}. {q.statement} ({q.points} pt{q.points > 1 ? "s" : ""})
          </p>
          <div className="choice-list">
            {q.choices.map((choice) => (
              <label key={choice.id} className="choice-item">
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  checked={answers[q.id] === choice.id}
                  onChange={() => selectChoice(q.id, choice.id)}
                />
                {choice.text}
              </label>
            ))}
          </div>
        </div>
      ))}

      <Button onClick={() => setConfirmOpen(true)} disabled={submitting}>
        Soumettre l'examen
      </Button>

      {confirmOpen && (
        <div className="confirm-modal">
          <p>
            Tu as répondu à {Object.keys(answers).length} question(s) sur{" "}
            {exam.questions.length}. Une fois soumis, tu ne pourras plus modifier tes réponses.
          </p>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Envoi..." : "Confirmer la soumission"}
          </Button>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            Annuler
          </Button>
        </div>
      )}
    </div>
  );
}