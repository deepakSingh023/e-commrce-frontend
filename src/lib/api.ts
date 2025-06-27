import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Automatically attach token
API.interceptors.request.use((config) => {
 const adminRaw = localStorage.getItem("admin");
 const adminData = adminRaw ? JSON.parse(adminRaw) : null;
 const token = adminData?.token;
console.log("TOKEN SENT:", token); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
