import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Automatically attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // or sessionStorage or context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
