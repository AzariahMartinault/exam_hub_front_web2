import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import { getExamById } from "../../api/exams";
import { getExamQuestions, createQuestion, deleteQuestion } from "../../api/questions";

export default function AdminExamQuestions() {
  const { id } = useParams();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statement, setStatement] = useState("");
  const [points, setPoints] = useState(1);
  const [choices, setChoices] = useState([
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      const [examData, questionsData] = await Promise.all([
        getExamById(id),
        getExamQuestions(id),
      ]);
      setExam(examData);
      setQuestions(questionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleChoiceTextChange(index, value) {
    const updated = [...choices];
    updated[index].text = value;
    setChoices(updated);
  }

  function handleCorrectChange(index) {
    const updated = choices.map((choice, i) => ({
      ...choice,
      is_correct: i === index,
    }));
    setChoices(updated);
  }

  function addChoice() {
    if (choices.length >= 6) return;
    setChoices([...choices, { text: "", is_correct: false }]);
  }

  function removeChoice() {
    if (choices.length <= 2) return;
    setChoices(choices.slice(0, -1));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    const hasCorrectChoice = choices.some((c) => c.is_correct);
    if (!hasCorrectChoice) {
      setError("Vous devez sélectionner un choix correct.");
      return;
    }

    try {
      await createQuestion(id, { statement, points: Number(points), choices });
      setStatement("");
      setPoints(1);
      setChoices([
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ]);
      loadData();
    } catch (err) {
      setError(err.message);
      loadData();
    }
  }

  async function handleDelete(questionId) {
    setError("");
    try {
      await deleteQuestion(questionId);
      loadData();
    } catch (err) {
      setError(err.message);
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

  const isLocked = exam?.attempt_count > 0;

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[var(--color-sidebar)] mb-2">
          Questions de l'examen : {exam?.title}
        </h1>

        {error && (
          <p className="text-sm text-[var(--color-danger)] bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {isLocked ? (
          <span className="inline-block -rotate-2 px-3 py-1 text-xs font-bold uppercase tracking-wide border-2 border-[var(--color-warning)] text-[var(--color-warning)] rounded mb-6">
            Verrouillé — tentatives en cours
          </span>
        ) : (
          <p className="text-sm text-gray-500 mb-6">{exam?.question_count} question(s) actuellement.</p>
        )}

        {!isLocked && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Ajouter une question
            </h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Énoncé de la question"
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  required
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
                <input
                  type="number"
                  placeholder="Points"
                  min="1"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  required
                  className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                {choices.map((choice, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder={`Choix ${index + 1}`}
                      value={choice.text}
                      onChange={(e) => handleChoiceTextChange(index, e.target.value)}
                      required
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    />
                    <label className="flex items-center gap-1.5 text-sm text-gray-600">
                      <input
                        type="radio"
                        name="correctChoice"
                        checked={choice.is_correct}
                        onChange={() => handleCorrectChange(index)}
                        className="accent-[var(--color-accent)]"
                      />
                      Correct
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addChoice}
                  disabled={choices.length >= 6}
                  className="text-sm text-[var(--color-accent)] hover:underline disabled:opacity-40 disabled:no-underline"
                >
                  + Ajouter un choix
                </button>
                <button
                  type="button"
                  onClick={removeChoice}
                  disabled={choices.length <= 2}
                  className="text-sm text-gray-500 hover:underline disabled:opacity-40 disabled:no-underline"
                >
                  - Retirer un choix
                </button>
              </div>

              <button
                type="submit"
                className="self-start bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
              >
                Créer la question
              </button>
            </form>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex justify-between items-start">
                <p className="font-medium">{q.statement}</p>
                <span className="text-xs font-[var(--font-mono)] text-gray-400">{q.points} pts</span>
              </div>
              <ul className="mt-2 flex flex-col gap-1">
                {q.choices.map((c) => (
                  <li
                    key={c.id}
                    className={`text-sm ${c.is_correct ? "text-[var(--color-success)] font-medium" : "text-gray-500"}`}
                  >
                    {c.text} {c.is_correct && "✓"}
                  </li>
                ))}
              </ul>
              {!isLocked && (
                <button
                  onClick={() => handleDelete(q.id)}
                  className="mt-3 text-[var(--color-danger)] hover:underline text-sm font-medium"
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}