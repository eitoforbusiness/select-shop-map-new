import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { logout } from './auth';

export const Service = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

Service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('authToken');
  const expiresAt = localStorage.getItem('tokenExpiresAt');

  if (token && expiresAt) {
    const expirationDate = new Date(expiresAt);
    if (expirationDate < new Date()) {
      // トークンが期限切れの場合、ログアウト処理を実行
      logout();
      return Promise.reject(new Error('トークンの有効期限が切れています'));
    }
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 