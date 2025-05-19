// src/services/typeEntrepriseService.js
import axiosClient from "../api/axiosClient";

const BASE_URL = "/api/type-entreprises";

export const fetchTypeEntreprises = () =>
  axiosClient.get(BASE_URL);

export const fetchTypeEntreprise = (id) =>
  axiosClient.get(`${BASE_URL}/${id}`);

export const createTypeEntreprise = (data) =>
  axiosClient.post(BASE_URL, data);

export const updateTypeEntreprise = (id, data) =>
  axiosClient.put(`${BASE_URL}/${id}`, data);

export const deleteTypeEntreprise = (id) =>
  axiosClient.delete(`${BASE_URL}/${id}`);
