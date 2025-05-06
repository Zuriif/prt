// src/services/produitService.js
import axiosClient from "../api/axiosClient";

export const fetchProduits = () => 
  axiosClient.get("/api/produits");

export const fetchProduit = (id) => 
  axiosClient.get(`/api/produits/${id}`);

export const createProduit = (data) => 
  axiosClient.post("/api/produits", data);

export const updateProduit = (id, data) => 
  axiosClient.put(`/api/produits/${id}`, data);

export const deleteProduit = (id) => 
  axiosClient.delete(`/api/produits/${id}`);
