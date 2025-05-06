// src/services/entiteService.js
import client from "../api/axiosClient";

export const fetchEntites = () => client.get("/api/entites");
export const fetchEntite  = (id) => client.get(`/api/entites/${id}`);
export const createEntite = (data) => client.post("/api/entites", data);
export const updateEntite = (id, data) =>
client.put(`/api/entites/${id}`, data);
export const deleteEntite = (id) => client.delete(`/api/entites/${id}`);
