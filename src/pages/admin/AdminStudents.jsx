import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
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
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[var(--color-sidebar)] mb-6">
          Gestion des étudiants
        </h1>

        {error && (
          <p className="text-sm text-[var(--color-danger)] bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            Ajouter un étudiant
          </h2>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <input
              type="password"
              placeholder="Mot de passe initial"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            />
            <button
              type="submit"
              className="bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
            >
              Créer
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-6 text-sm text-gray-500">Chargement...</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-6 py-3">Nom</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-t border-gray-100">
                    <td className="px-6 py-3">{student.name}</td>
                    <td className="px-6 py-3">{student.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block -rotate-2 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide border-2 rounded ${
                          student.is_active
                            ? "border-[var(--color-success)] text-[var(--color-success)]"
                            : "border-[var(--color-danger)] text-[var(--color-danger)]"
                        }`}
                      >
                        {student.is_active ? "Actif" : "Désactivé"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {student.is_active && (
                        <button
                          onClick={() => handleDeactivate(student.id)}
                          className="text-[var(--color-danger)] hover:underline text-sm font-medium"
                        >
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
      </main>
    </div>
  );
}