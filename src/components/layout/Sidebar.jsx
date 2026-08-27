import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../api/auth";

const adminLinks = [
  { to: "/admin", label: "Tableau de bord", end: true },
  { to: "/admin/students", label: "Étudiants" },
  { to: "/admin/courses", label: "Cours" },
  { to: "/admin/exams", label: "Examens" },
];

const studentLinks = [
  { to: "/student", label: "Examens", end: true },
  { to: "/student/results", label: "Mes résultats" },
];

export default function Sidebar() {
  const user = getUser();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";
  const links = isAdmin ? adminLinks : studentLinks;

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-sidebar px-4 py-6">
      <div className="mb-8 px-2">
        <h1 className="font-display text-xl font-bold text-white">
          Exam Hub
        </h1>
        <p className="mt-0.5 text-xs text-gray-400">
          {isAdmin ? "Espace administrateur" : "Espace étudiant"}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-2 pt-4">
        <p className="truncate text-sm font-medium text-white">{user?.name}</p>
        <p className="mb-3 text-xs text-gray-400">{user?.role}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left text-sm text-gray-300 transition-colors hover:text-white"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}