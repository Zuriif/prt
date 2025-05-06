// src/services/sousSecteurService.js
import axiosClient from "../api/axiosClient";

export const fetchSousSecteurs = () =>
  axiosClient.get("/api/sous-secteurs");

export const fetchSousSecteur = (id) =>
  axiosClient.get(`/api/sous-secteurs/${id}`);

export const createSousSecteur = (data) =>
  axiosClient.post("/api/sous-secteurs", data);

export const updateSousSecteur = (id, data) =>
  axiosClient.put(`/api/sous-secteurs/${id}`, data);

export const deleteSousSecteur = (id) =>
  axiosClient.delete(`/api/sous-secteurs/${id}`);
