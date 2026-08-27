import { Link } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";

export default function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-[var(--color-sidebar)] mb-6">
          Tableau de bord admin
        </h1>

        <div className="grid grid-cols-3 gap-4">
          <Link
            to="/admin/students"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <p className="text-3xl font-bold text-[var(--color-accent)] font-[var(--font-mono)]">--</p>
            <p className="text-sm text-gray-500 mt-1">Étudiants</p>
          </Link>

          <Link
            to="/admin/courses"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <p className="text-3xl font-bold text-[var(--color-accent)] font-[var(--font-mono)]">--</p>
            <p className="text-sm text-gray-500 mt-1">Cours</p>
          </Link>

          <Link
            to="/admin/exams"
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <p className="text-3xl font-bold text-[var(--color-accent)] font-[var(--font-mono)]">--</p>
            <p className="text-sm text-gray-500 mt-1">Examens</p>
          </Link>
        </div>
      </main>
    </div>
  );
}