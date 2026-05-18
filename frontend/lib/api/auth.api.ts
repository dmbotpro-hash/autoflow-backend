import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
});

api.interceptors.request.use((config) => {
  // If you already store JWT in cookies/localStorage, integrate here.
  // Keeping it generic for now.
  return config;
});

export default api;

