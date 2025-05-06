// src/services/fonctionnaireService.js
import axiosClient from "../api/axiosClient";

export const fetchFonctionnaires = () =>
  axiosClient.get("/api/fonctionnaires");

export const fetchFonctionnaire = (id) =>
  axiosClient.get(`/api/fonctionnaires/${id}`);

export const createFonctionnaire = (data) =>
  axiosClient.post("/api/fonctionnaires", data);

export const updateFonctionnaire = (id, data) =>
  axiosClient.put(`/api/fonctionnaires/${id}`, data);

export const deleteFonctionnaire = (id) =>
  axiosClient.delete(`/api/fonctionnaires/${id}`);
