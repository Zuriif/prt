// src/services/authService.js
import axiosClient from "../api/axiosClient";

/**
 * POST /api/auth/login
 * body { email, motDePasse }
 * returns { token }
 */
export const login = ({ email, motDePasse }) =>
  axiosClient.post("/api/auth/login", { email, motDePasse });

/**
 * POST /api/auth/register
 * body { nom, email, motDePasse, role }
 * returns { token }
 */
export const register = ({ nom, email, motDePasse, role }) =>
  axiosClient.post("/api/auth/register", { nom, email, motDePasse, role });
