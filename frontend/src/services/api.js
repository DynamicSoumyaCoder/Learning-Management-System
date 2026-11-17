const BASE_URL = 'http://localhost:8080/api/v1';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      (data && data.message) ||
      (data && data.details && data.details.join(', ')) ||
      'An error occurred';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  registerInstructor: (payload) =>
    request('/auth/register-instructor', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  changePassword: (email, oldPassword, newPassword) =>
    request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ email, oldPassword, newPassword }),
    }),

  // Instructor
  addStudent: (studentData) =>
    request('/instructor/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    }),

  getStudents: () => request('/instructor/students'),

  enrollStudent: (studentId, courseId) =>
    request('/instructor/enroll', {
      method: 'POST',
      body: JSON.stringify({ studentId, courseId }),
    }),

  getInstructorDashboardProgress: (instructorId) => {
    const query = instructorId ? `?instructorId=${instructorId}` : '';
    return request(`/instructor/dashboard/progress${query}`);
  },

  // Courses
  getCourses: (instructorId) => {
    const query = instructorId ? `?instructorId=${instructorId}` : '';
    return request(`/courses${query}`);
  },

  getCourseById: (id) => request(`/courses/${id}`),

  createCourse: (courseData) =>
    request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),

  deleteCourse: (id) =>
    request(`/courses/${id}`, {
      method: 'DELETE',
    }),

  // Activities
  getCourseActivities: (courseId) => request(`/courses/${courseId}/activities`),

  addActivity: (courseId, activityData) =>
    request(`/courses/${courseId}/activities`, {
      method: 'POST',
      body: JSON.stringify(activityData),
    }),

  deleteActivity: (activityId) =>
    request(`/courses/activities/${activityId}`, {
      method: 'DELETE',
    }),

  // Student LMS Portal
  getStudentCourses: (studentId) => request(`/student/${studentId}/courses`),

  getCourseLearningRoom: (studentId, courseId) =>
    request(`/student/${studentId}/courses/${courseId}`),

  completeActivity: (studentId, activityId) =>
    request(`/student/${studentId}/activities/${activityId}/complete`, {
      method: 'POST',
    }),
};
