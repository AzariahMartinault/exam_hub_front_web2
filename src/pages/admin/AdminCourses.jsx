import { useState, useEffect } from "react";
import { getCourses, createCourse, deleteCourse } from "../../api/courses";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
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
      await createCourse({ code, name, description });
      setCode("");
      setName("");
      setDescription("");
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteCourse(id);
      loadCourses();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Gestion des cours</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Ajouter un cours</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Code (ex: PROG2)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom du cours"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Créer</button>
      </form>

      <h2>Liste des cours</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Examens</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.code}</td>
                <td>{course.name}</td>
                <td>{course.description}</td>
                <td>{course.exam_count}</td>
                <td>
                  <button onClick={() => handleDelete(course.id)}>
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