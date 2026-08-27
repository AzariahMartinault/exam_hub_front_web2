import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";

import StudentLayout from "../components/layout/StudentLayout";
import ExamList from "../pages/student/ExamList";
import ExamTake from "../pages/student/ExamTake";
import History from "../pages/student/History";

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

      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<ExamList />} />
          <Route path="exams/:id" element={<ExamTake />} />
          <Route path="results" element={<History />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/exams" element={<AdminExams />} />
        <Route path="/admin/exams/:id/questions" element={<AdminExamQuestions />} />
        <Route path="/admin/exams/:id/results" element={<AdminExamResults />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}