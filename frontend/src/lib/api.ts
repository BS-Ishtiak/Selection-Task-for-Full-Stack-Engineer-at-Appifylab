import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Attach Authorization header from localStorage if available
api.interceptors.request.use((config) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

// Redirect to /login on 401 Unauthorized responses
api.interceptors.response.use(
  (resp) => resp,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      if (typeof window !== 'undefined') {
        // remove tokens and redirect
        try {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        } catch (e) {}
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
