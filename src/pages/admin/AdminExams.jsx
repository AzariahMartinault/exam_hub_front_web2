import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getExams, createExam, deleteExam } from "../../api/exams";
import { getCourses } from "../../api/courses";

export default function AdminExams() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [examsData, coursesData] = await Promise.all([
        getExams(),
        getCourses(),
      ]);
      setExams(examsData);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await createExam({
        course_id: Number(courseId),
        title,
        description,
        starts_at: startsAt,
        ends_at: endsAt,
      });
      setTitle("");
      setDescription("");
      setCourseId("");
      setStartsAt("");
      setEndsAt("");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteExam(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Gestion des examens</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Ajouter un examen</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          <option value="">-- Choisir un cours --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code} - {course.name}
            </option>
          ))}
        </select>

        <label>
          Début :
          <input
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            required
          />
        </label>

        <label>
          Fin :
          <input
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            required
          />
        </label>

        <button type="submit">Créer</button>
      </form>

      <h2>Liste des examens</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Cours</th>
              <th>Questions</th>
              <th>Tentatives</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.title}</td>
                <td>{exam.course?.code}</td>
                <td>{exam.question_count}</td>
                <td>{exam.attempt_count}</td>
                <td>
                  <Link to={`/admin/exams/${exam.id}/questions`}>Questions</Link>
                  {" | "}
                  <Link to={`/admin/exams/${exam.id}/results`}>Résultats</Link>
                  {" | "}
                  <button onClick={() => handleDelete(exam.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}