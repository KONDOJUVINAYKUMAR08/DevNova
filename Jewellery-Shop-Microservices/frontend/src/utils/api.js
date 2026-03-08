import axios from 'axios';

const API_BASE = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || '')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://api-gateway:80');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/users/register', data),
  login: (data) => api.post('/api/users/login', data),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getAllUsers: (params) => api.get('/api/users', { params }),
  toggleUserStatus: (id) => api.put(`/api/users/${id}/status`),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
};

// Product API
export const productAPI = {
  getAll: (params) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  getFeatured: () => api.get('/api/products/featured'),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
  create: (data) => api.post('/api/categories', data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

// Rate API
export const rateAPI = {
  getAll: () => api.get('/api/rates'),
  getByMetal: (metal) => api.get(`/api/rates/${metal}`),
  update: (data) => api.put('/api/rates', data),
  bulkUpdate: (data) => api.post('/api/rates/bulk', data),
  seed: () => api.post('/api/rates/seed'),
};

// Order API
export const orderAPI = {
  create: (data) => api.post('/api/orders', data),
  getMyOrders: (params) => api.get('/api/orders', { params }),
  getById: (id) => api.get(`/api/orders/${id}`),
  getAll: (params) => api.get('/api/orders/all', { params }),
  getStats: () => api.get('/api/orders/stats'),
  updateStatus: (id, data) => api.put(`/api/orders/${id}/status`, data),
  delete: (id) => api.delete(`/api/orders/${id}`),
};

// Review API
export const reviewAPI = {
  create: (data) => api.post('/api/reviews', data),
  getProductReviews: (productId, params) => api.get(`/api/reviews/product/${productId}`, { params }),
  getAll: (params) => api.get('/api/reviews', { params }),
  update: (id, data) => api.put(`/api/reviews/${id}`, data),
  delete: (id) => api.delete(`/api/reviews/${id}`),
  getStats: () => api.get('/api/reviews/stats'),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/api/admin/dashboard'),
  healthCheck: () => api.get('/api/admin/health-check'),
};

export default api;
