import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors and refresh token if possible
let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (localStorage.getItem('refresh_token')) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          const refresh = localStorage.getItem('refresh_token');
          const res = await api.post('/token/refresh/', { refresh });
          localStorage.setItem('access_token', res.data.access);
          api.defaults.headers.common['Authorization'] =
            'Bearer ' + res.data.access;
          processQueue(null, res.data.access);
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth ---
export const register = (data: {
  username: string;
  password: string;
  email: string;
}) => api.post('/register/', data);

export const login = (data: { username: string; password: string }) =>
  api.post('/token/', data);

export const refreshToken = (refresh: string) =>
  api.post('/token/refresh/', { refresh });

// --- Trip Management ---
export const createTrip = (data: any) => api.post('/trips/', data);

export const getTrips = () => api.get('/trips/');

export const getTrip = (id: string | number) => api.get(`/trips/${id}/`);

export const planTrip = (id: string | number) =>
  api.post(`/trips/${id}/plan/`, {});

// --- Log Management ---
export const generateLogs = (tripId: string | number) =>
  api.post('/logs/generate_logs/', { trip: tripId });

export const getLogs = () => api.get('/logs/');

export const getLog = (id: string | number) => api.get(`/logs/${id}/`);

export const getLogGrid = (id: string | number) =>
  api.get(`/logs/${id}/grid/`, { responseType: 'blob' });

// --- Duty Status Management ---
export const getDutyStatusList = () => api.get('/duty-status/');
export const createDutyStatus = (data: any) => api.post('/duty-status/', data);
export const getDutyStatus = (id: string | number) =>
  api.get(`/duty-status/${id}/`);
export const updateDutyStatus = (id: string | number, data: any) =>
  api.put(`/duty-status/${id}/`, data);
export const partialUpdateDutyStatus = (id: string | number, data: any) =>
  api.patch(`/duty-status/${id}/`, data);
export const deleteDutyStatus = (id: string | number) =>
  api.delete(`/duty-status/${id}/`);

// --- LogSheet Management ---
export const getLogSheets = () => api.get('/logs/');
export const createLogSheet = (data: any) => api.post('/logs/', data);
export const getLogSheet = (id: string | number) => api.get(`/logs/${id}/`);
export const updateLogSheet = (id: string | number, data: any) =>
  api.put(`/logs/${id}/`, data);
export const partialUpdateLogSheet = (id: string | number, data: any) =>
  api.patch(`/logs/${id}/`, data);
export const deleteLogSheet = (id: string | number) =>
  api.delete(`/logs/${id}/`);
export const getLogSheetGrid = (id: string | number) =>
  api.get(`/logs/${id}/grid/`, { responseType: 'blob' });

export default api;
