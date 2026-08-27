import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";

export default function ExamResult({ exam, result }) {
  function getChoiceText(questionId, choiceId) {
    if (choiceId == null) return null;
    const question = exam.questions.find((q) => q.id === questionId);
    return question?.choices.find((c) => c.id === choiceId)?.text;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">{exam.title}</h2>
        <p className="mt-2 text-3xl font-bold text-blue-600">
          {result.score} / {result.total_points}
        </p>
        <p className="text-sm text-gray-500">points obtenus</p>
      </div>

      <div className="flex flex-col gap-3">
        {result.correction.map((line, index) => (
          <div
            key={line.question_id}
            className={`rounded-xl border p-4 shadow-sm ${
              line.is_correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
            }`}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <p className="font-medium text-gray-900">
                {index + 1}. {line.statement}
              </p>
              <Badge variant={line.is_correct ? "success" : "danger"}>
                {line.is_correct ? "Correct" : "Incorrect"}
              </Badge>
            </div>
            <p className="text-sm text-gray-700">
              Ta réponse :{" "}
              <span className="font-medium">
                {getChoiceText(line.question_id, line.student_choice_id) || "Non répondue"}
              </span>
            </p>
            {!line.is_correct && (
              <p className="text-sm text-gray-700">
                Bonne réponse :{" "}
                <span className="font-medium">
                  {getChoiceText(line.question_id, line.correct_choice_id)}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>

      <Link
        to="/student"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Retour aux examens
      </Link>
    </div>
  );
}