import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Menu APIs
export const menuAPI = {
  getAll: () => api.get("/menu"),
  getById: (id) => api.get(`/menu/${id}`),
  create: (data) => api.post("/menu", data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
};

// Order APIs
export const orderAPI = {
  getAll: () => api.get("/orders"),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post("/orders", data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (data) => api.post("/auth/register", data),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => api.get("/analytics/dashboard"),
};

export default api;
