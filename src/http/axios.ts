import axios from 'axios';
import { APP_CONFIG } from '@/config/constants';

export const authHttp = axios.create({
  baseURL: APP_CONFIG.AUTH_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const botHttp = axios.create({
  baseURL: APP_CONFIG.BOT_API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

botHttp.interceptors.request.use((config) => {
  // Priority: runtime token from login > static token from .env
  const token = localStorage.getItem('token') || APP_CONFIG.BOT_TOKEN || '';
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

botHttp.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
