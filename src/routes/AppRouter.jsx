import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import StudentLayout from "../components/layout/StudentLayout";
import ExamList from "../pages/student/ExamList";
import ExamTake from "../pages/student/ExamTake";
import History from "../pages/student/History";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<ExamList />} />
          <Route path="exams/:id" element={<ExamTake />} />
          <Route path="results" element={<History />} />
        </Route>
      </Route>

      {/* espace admin branché par ton/ta collègue */}

      <Route path="/" element={<Navigate to="/student" replace />} />
      <Route path="*" element={<Navigate to="/student" replace />} />
    </Routes>
  );
}