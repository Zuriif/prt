// src/api/axiosClient.js
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080", // URL de ton API Gateway
});

client.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default client;
