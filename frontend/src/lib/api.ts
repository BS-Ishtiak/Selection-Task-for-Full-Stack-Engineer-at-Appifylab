import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Manage Authorization header explicitly via helpers exported below.
export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export function clearAuthToken() {
  delete api.defaults.headers.common['Authorization'];
}

// Response interceptor: on 401 clear tokens and redirect to login
// NOTE: Response handling (401 -> refresh) is managed by the AuthProvider
// so we keep this file limited to the axios instance and header helpers.

export default api;
