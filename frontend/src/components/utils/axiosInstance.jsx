// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  config.headers = {
    ...config.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };
  return config;
});

export default axiosInstance;