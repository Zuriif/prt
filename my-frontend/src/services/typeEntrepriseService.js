// src/services/typeEntrepriseService.js
import axiosClient from "../api/axiosClient";

export const fetchTypeEntreprises = () =>
  axiosClient.get("/api/type-entreprises");

export const fetchTypeEntreprise = (id) =>
  axiosClient.get(`/api/type-entreprises/${id}`);

export const createTypeEntreprise = (data) =>
  axiosClient.post("/api/type-entreprises", data);

export const updateTypeEntreprise = (id, data) =>
  axiosClient.put(`/api/type-entreprises/${id}`, data);

export const deleteTypeEntreprise = (id) =>
  axiosClient.delete(`/api/type-entreprises/${id}`);
