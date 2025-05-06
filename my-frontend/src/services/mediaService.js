// src/services/mediaService.js
import axiosClient from "../api/axiosClient";

// Récupérer tous les médias
export const fetchMedia = () =>
  axiosClient.get("/api/media");

// Récupérer les médias d’une entité spécifique
export const fetchMediaByEntite = (entiteId) =>
  axiosClient.get(`/api/media/entite/${entiteId}`);

// Uploader un fichier (multipart/form-data)
export const uploadMedia = (file, entiteId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("entiteId", entiteId);
  return axiosClient.post("/api/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Télécharger un média (blob)
export const downloadMedia = (id) =>
  axiosClient.get(`/api/media/download/${id}`, { responseType: "blob" });

// Supprimer un média
export const deleteMedia = (id) =>
  axiosClient.delete(`/api/media/${id}`);
