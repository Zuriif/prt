// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import client from "../api/axiosClient";

// Décode le payload d'un JWT (sans vérification de signature)
function decodeJwt(token) {
  try {
    if (!token) return null;
    const payloadBase64 = token.split(".")[1];
    const payloadJson = atob(payloadBase64);
    const decoded = JSON.parse(payloadJson);
    console.log('Decoded JWT:', decoded); // Debug log
    return {
      email: decoded.sub,
      role: decoded.role,
      nom: decoded.nom,
      exp: decoded.exp
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          const decoded = decodeJwt(token);
          if (decoded) {
            setUser(decoded);
          } else {
            // If token is invalid, clear it
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      console.log('Login request payload:', {
        email: credentials.email,
        motDePasse: credentials.password
      });

      const response = await client.post("/api/auth/login", {
        email: credentials.email,
        motDePasse: credentials.password
      });
      
      console.log('Login response:', response.data);
      
      const newToken = response.data.token;
      if (!newToken) {
        throw new Error('Token not received');
      }

      localStorage.setItem("token", newToken);
      setToken(newToken);
      const decoded = decodeJwt(newToken);
      console.log('Decoded user after login:', decoded); // Debug log
      
      if (!decoded) {
        throw new Error('Failed to decode user information');
      }
      
      setUser(decoded);
      return decoded;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  const updateUser = async (userData) => {
    try {
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await client.put("/api/auth/update-profile", userData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        const decoded = decodeJwt(response.data.token);
        setUser(decoded);
      }
      
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
