import { NavLink, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../api/auth";

export default function Sidebar() {
  const user = getUser();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">Exam Hub</div>

      <div className="sidebar-user">
        <p>{user?.name}</p>
        <p className="sidebar-role">Étudiant</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/student" end>
          Examens
        </NavLink>
        <NavLink to="/student/results">Mes résultats</NavLink>
      </nav>

      <button onClick={handleLogout} className="sidebar-logout">
        Se déconnecter
      </button>
    </aside>
  );
}