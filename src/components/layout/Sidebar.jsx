import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../api/auth";

export default function Sidebar() {
  const user = getUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const linkClass = ({ isActive }) =>
    `flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white p-4">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
          E
        </div>
        <span className="text-lg font-semibold text-gray-900">ExamHub</span>
      </div>

      <div className="mb-6 border-b border-gray-100 px-2 pb-4">
        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
        <p className="text-xs text-gray-500">Student</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <NavLink to="/student" end className={linkClass}>
          Examinations
        </NavLink>
        <NavLink to="/student/results" className={linkClass}>
          My Results
        </NavLink>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-4 rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-100"
      >
        Log out
      </button>
    </aside>
  );
}