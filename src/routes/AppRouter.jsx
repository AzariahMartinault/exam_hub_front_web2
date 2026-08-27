import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminStudents from "../pages/admin/AdminStudents";
import AdminCourses from "../pages/admin/AdminCourses";
import AdminExams from "../pages/admin/AdminExams";
import AdminExamQuestions from "../pages/admin/AdminExamQuestions";
import AdminExamResults from "../pages/admin/AdminExamResults";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/courses"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminCourses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams/:id/questions"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminExamQuestions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/exams/:id/results"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminExamResults />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}