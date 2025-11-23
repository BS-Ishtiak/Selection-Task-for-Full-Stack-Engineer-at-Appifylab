import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send cookies (for refresh token)
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
}

export function setAuthToken(token?: string | null) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export function clearAuthToken() {
  delete api.defaults.headers.common['Authorization'];
}

// Refresh function: calls backend to exchange refresh token (cookie) for access token
async function refreshAccessToken(): Promise<string> {
  // Prefer refresh token from localStorage (if app stored it), otherwise rely on httpOnly cookie.
  const storedRefresh = (typeof window !== 'undefined' && window.localStorage) ? window.localStorage.getItem('refreshToken') : null;
  let resp;
  if (storedRefresh) {
    resp = await api.post('/api/auth/token', { refreshToken: storedRefresh });
  } else {
    // Assumes backend reads refresh token from httpOnly cookie (sent via withCredentials)
    resp = await api.post('/api/auth/token', {});
  }
  const payload = resp?.data;
  if (!payload?.success || !payload?.data?.accessToken) throw new Error('Failed to refresh token');
  const newToken = payload.data.accessToken;
  setAuthToken(newToken);
  return newToken;
}

// Response interceptor to handle 401/403 and queue requests during refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: AxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (!originalRequest) return Promise.reject(error);

    // Only handle 401/403 once per request
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        // queue request until refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token?: string) => {
              if (token) originalRequest.headers = originalRequest.headers || {}, (originalRequest.headers as any)['Authorization'] = `Bearer ${token}`;
              (originalRequest as any)._retry = true;
              resolve(api(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        isRefreshing = false;
        originalRequest.headers = originalRequest.headers || {};
        (originalRequest.headers as any)['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
