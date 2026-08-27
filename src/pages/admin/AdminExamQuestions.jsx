import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
      await createQuestion(id, {
        statement,
        points: Number(points),
        choices,
      });
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

  if (loading) return <p>Chargement...</p>;

  return (
    <div>
      <h1>Questions de l'examen : {exam?.title}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p>
        {exam?.attempt_count > 0
          ? "⚠ Cet examen a déjà des tentatives : les questions ne sont plus modifiables."
          : `${exam?.question_count} question(s) actuellement.`}
      </p>

      {exam?.attempt_count === 0 && (
        <>
          <h2>Ajouter une question</h2>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              placeholder="Énoncé de la question"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Points"
              min="1"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              required
            />

            <h3>Choix de réponse</h3>
            {choices.map((choice, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={`Choix ${index + 1}`}
                  value={choice.text}
                  onChange={(e) => handleChoiceTextChange(index, e.target.value)}
                  required
                />
                <label>
                  <input
                    type="radio"
                    name="correctChoice"
                    checked={choice.is_correct}
                    onChange={() => handleCorrectChange(index)}
                  />
                  Correct
                </label>
              </div>
            ))}

            <button type="button" onClick={addChoice} disabled={choices.length >= 6}>
              + Ajouter un choix
            </button>
            <button type="button" onClick={removeChoice} disabled={choices.length <= 2}>
              - Retirer un choix
            </button>

            <br />
            <button type="submit">Créer la question</button>
          </form>
        </>
      )}

      <h2>Liste des questions</h2>
      {questions.map((q) => (
        <div key={q.id}>
          <p><strong>{q.statement}</strong> ({q.points} pts)</p>
          <ul>
            {q.choices.map((c) => (
              <li key={c.id} style={{ color: c.is_correct ? "green" : "black" }}>
                {c.text} {c.is_correct && "✓"}
              </li>
            ))}
          </ul>
          {exam?.attempt_count === 0 && (
            <button onClick={() => handleDelete(q.id)}>Supprimer</button>
          )}
        </div>
      ))}
    </div>
  );
}