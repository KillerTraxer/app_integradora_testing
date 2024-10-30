import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_APP_API_URL
});

export default api;