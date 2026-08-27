import { NavLink } from "react-router-dom";
import { logout, getUser } from "../../api/auth";

const adminLinks = [
  { to: "/admin", label: "Tableau de bord", end: true },
  { to: "/admin/students", label: "Étudiants" },
  { to: "/admin/courses", label: "Cours" },
  { to: "/admin/exams", label: "Examens" },
];

export default function Sidebar() {
  const user = getUser();

  return (
    <aside className="w-64 min-h-screen bg-[var(--color-sidebar)] flex flex-col px-4 py-6">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold text-white font-[var(--font-display)]">
          Exam Hub
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">Espace administrateur</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {adminLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[var(--color-accent)] text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 pt-4 px-2">
        <p className="text-sm text-white font-medium truncate">{user?.name}</p>
        <p className="text-xs text-gray-400 mb-3">{user?.role}</p>
        <button
          onClick={logout}
          className="w-full text-left text-sm text-gray-300 hover:text-white transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}