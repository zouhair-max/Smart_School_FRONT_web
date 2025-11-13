import { api } from '../../../config/api';

export const dashboardAPI = {
  // Get complete dashboard data
  getDashboard: () => api.get('/dashboard'),

  // Get specific section data
  getSection: (section) => api.get(`/dashboard/${section}`),

  // Get table-specific data
  getTableStatus: (table) => api.get(`/dashboard/table/${table}`),
  
  // Get individual endpoints for debugging
  getOverviewStats: () => api.get('/dashboard/overview'),
  getSchoolsStatus: () => api.get('/dashboard/schools'),
  getUsersStatus: () => api.get('/dashboard/users'),
  getAcademicStatus: () => api.get('/dashboard/academic'),
  getRecentActivities: () => api.get('/dashboard/activities'),
  getSystemHealth: () => api.get('/dashboard/system-health'),
};

// Schools API with full CRUD
export const schoolsAPI = {
  // Get all schools
  getSchools: () => api.get('/schools'),
  
  // Get single school
  getSchool: (id) => api.get(`/schools/${id}`),
  
  // Create school
  createSchool: (data) => api.post('/schools', data),
  
  // Update school
  updateSchool: (id, data) => api.put(`/schools/${id}`, data),
  
  // Delete school
  deleteSchool: (id) => api.delete(`/schools/${id}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

export default api;