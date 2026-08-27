import { apiClient } from "./client";

export function getStudents() {
  return apiClient("/students");
}

export function createStudent(studentData) {
  return apiClient("/students", {
    method: "POST",
    body: JSON.stringify(studentData),
  });
}

export function updateStudent(id, studentData) {
  return apiClient(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(studentData),
  });
}

export function deactivateStudent(id) {
  return apiClient(`/students/${id}`, {
    method: "DELETE",
  });
}