"use client";


import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`, // your backend URL
});

// This sets the token from localStorage/sessionStorage before every request
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const token = parsedUser?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


export default API;
