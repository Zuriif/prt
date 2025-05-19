// src/services/mediaService.js
import axiosClient from "../api/axiosClient";

// Récupérer tous les médias
export const fetchMedia = () =>
  axiosClient.get("/api/media");

// Récupérer un média par son ID
export const fetchMediaById = (id) =>
  axiosClient.get(`/api/media/${id}`);

// Récupérer les médias d'une entité spécifique
export const fetchMediaByEntite = (entiteId) =>
  axiosClient.get(`/api/media/entite/${entiteId}`);

// Créer un nouveau média
export const createMedia = (media) =>
  axiosClient.post("/api/media", media);

// Mettre à jour un média
export const updateMedia = (id, media) =>
  axiosClient.put(`/api/media/${id}`, media);

// Uploader un fichier (multipart/form-data)
export const uploadMedia = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post("/api/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Télécharger un fichier
export const downloadMedia = (id) =>
  axiosClient.get(`/api/media/download/${id}`, {
    responseType: "blob",
  });

// Supprimer un média
export const deleteMedia = (id) =>
  axiosClient.delete(`/api/media/${id}`);
