import axios from 'axios';
import { clearSession, getToken } from '../services/TokenService';
import { navigateTo } from './navigationRef';

// VITE_API_URL debe terminar en /api; ver .env.example.
const axiosClient = axios.create({
  baseURL: import.meta.env?.VITE_API_URL,
});

axiosClient.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      navigateTo('/login');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
