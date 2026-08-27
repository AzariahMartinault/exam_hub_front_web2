import { Link } from "react-router-dom";
import { logout } from "../../api/auth";

export default function AdminDashboard() {
  return (
    <div>
      <h1>Tableau de bord admin</h1>
      <button onClick={logout}>Se déconnecter</button>

      <div>
        <p>Étudiants : --</p>
        <p>Cours : --</p>
        <p>Examens : --</p>
      </div>

      <nav>
        <ul>
          <li><Link to="/admin/students">Gérer les étudiants</Link></li>
          <li><Link to="/admin/courses">Gérer les cours</Link></li>
          <li><Link to="/admin/exams">Gérer les examens</Link></li>
        </ul>
      </nav>
    </div>
  );
}