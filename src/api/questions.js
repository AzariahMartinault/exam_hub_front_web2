import { apiClient } from "./client";

export function getExamQuestions(examId) {
  return apiClient(`/exams/${examId}/questions`);
}

export function createQuestion(examId, questionData) {
  return apiClient(`/exams/${examId}/questions`, {
    method: "POST",
    body: JSON.stringify(questionData),
  });
}

export function updateQuestion(id, questionData) {
  return apiClient(`/questions/${id}`, {
    method: "PUT",
    body: JSON.stringify(questionData),
  });
}

export function deleteQuestion(id) {
  return apiClient(`/questions/${id}`, {
    method: "DELETE",
  });
}