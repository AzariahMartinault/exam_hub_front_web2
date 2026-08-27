import { useState, useEffect } from "react";
import { getStudents, createStudent, deactivateStudent } from "../../api/students";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
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
      await createStudent({ name, email, password });
      setName("");
      setEmail("");
      setPassword("");
      loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeactivate(id) {
    try {
      await deactivateStudent(id);
      loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Gestion des étudiants</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Ajouter un étudiant</h2>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe initial"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Créer</button>
      </form>

      <h2>Liste des étudiants</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.is_active ? "Actif" : "Désactivé"}</td>
                <td>
                  {student.is_active && (
                    <button onClick={() => handleDeactivate(student.id)}>
                      Désactiver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}