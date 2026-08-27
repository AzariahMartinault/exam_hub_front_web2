import { apiClient } from "./client";

export function getAvailableExams() {
  return apiClient.get("/my/exams");
}

export function getExamDetail(id) {
  return apiClient.get(`/my/exams/${id}`);
}

export function submitExam(id, answers) {
  return apiClient.post(`/my/exams/${id}/submit`, { answers });
}

export function getMyResults() {
  return apiClient.get("/my/results");
}