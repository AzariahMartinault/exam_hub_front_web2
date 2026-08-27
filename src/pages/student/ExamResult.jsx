import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";

export default function ExamResult({ exam, result }) {
  function getChoiceText(questionId, choiceId) {
    if (choiceId == null) return null;
    const question = exam.questions.find((q) => q.id === questionId);
    return question?.choices.find((c) => c.id === choiceId)?.text;
  }

  return (
    <div className="exam-result">
      <h2>{exam.title} — Résultat</h2>
      <p className="exam-score">
        {result.score} / {result.total_points} points
      </p>

      {result.correction.map((line, index) => (
        <div
          key={line.question_id}
          className={`correction-line ${line.is_correct ? "correct" : "incorrect"}`}
        >
          <p>
            {index + 1}. {line.statement} ({line.points} pt
            {line.points > 1 ? "s" : ""})
          </p>
          <p>
            Ta réponse : {getChoiceText(line.question_id, line.student_choice_id) || "Non répondue"}
          </p>
          {!line.is_correct && (
            <p>Bonne réponse : {getChoiceText(line.question_id, line.correct_choice_id)}</p>
          )}
          <Badge variant={line.is_correct ? "success" : "danger"}>
            {line.is_correct ? "Correct" : "Incorrect"}
          </Badge>
        </div>
      ))}

      <Link to="/student" className="btn btn-primary">
        Retour aux examens
      </Link>
    </div>
  );
}