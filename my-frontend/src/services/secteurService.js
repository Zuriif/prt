// src/services/secteurService.js
import axiosClient from "../api/axiosClient";

export const fetchSecteurs = () =>
  axiosClient.get("/api/secteurs");

export const fetchSecteur = (id) =>
  axiosClient.get(`/api/secteurs/${id}`);

export const createSecteur = (data) =>
  axiosClient.post("/api/secteurs", data);

export const updateSecteur = (id, data) =>
  axiosClient.put(`/api/secteurs/${id}`, data);

export const deleteSecteur = (id) =>
  axiosClient.delete(`/api/secteurs/${id}`);
