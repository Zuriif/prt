// src/contexts/AuthContext.jsx
import { createContext, useState } from "react";

// Décode le payload d'un JWT (sans vérification de signature)
function decodeJwt(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    return JSON.parse(payloadJson);
  } catch {
    return null;
  }
}

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Récupère le token en localStorage
  const [token, setToken] = useState(localStorage.getItem("token"));
  // Décode l’utilisateur si le token existe
  const [user, setUser] = useState(token ? decodeJwt(token) : null);

  // Fonction pour connecter : stocke le token et décode l’utilisateur
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(decodeJwt(newToken));
  };

  // Fonction pour déconnecter : supprime le token
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
