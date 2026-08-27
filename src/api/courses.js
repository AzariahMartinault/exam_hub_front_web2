import { apiClient } from "./client";

export function getCourses() {
  return apiClient("/courses");
}

export function createCourse(courseData) {
  return apiClient("/courses", {
    method: "POST",
    body: JSON.stringify(courseData),
  });
}

export function updateCourse(id, courseData) {
  return apiClient(`/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(courseData),
  });
}

export function deleteCourse(id) {
  return apiClient(`/courses/${id}`, {
    method: "DELETE",
  });
}