import { apiClient } from "./client";

export function getExams() {
  return apiClient("/exams");
}

export function getExamById(id) {
  return apiClient(`/exams/${id}`);
}

export function createExam(examData) {
  return apiClient("/exams", {
    method: "POST",
    body: JSON.stringify(examData),
  });
}

export function updateExam(id, examData) {
  return apiClient(`/exams/${id}`, {
    method: "PUT",
    body: JSON.stringify(examData),
  });
}

export function deleteExam(id) {
  return apiClient(`/exams/${id}`, {
    method: "DELETE",
  });
}

export function getExamResults(id) {
  return apiClient(`/exams/${id}/results`);
}