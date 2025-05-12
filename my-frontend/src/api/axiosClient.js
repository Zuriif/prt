// src/api/axiosClient.js
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080", // URL de ton API Gateway
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor
client.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor
client.interceptors.response.use(
  response => response,
  error => {
    // Only redirect to login if it's a 401 and we're not already on the login page
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default client;
