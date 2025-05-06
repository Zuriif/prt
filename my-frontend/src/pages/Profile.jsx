import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const { token } = useContext(AuthContext);
  const decoded = token ? jwtDecode(token) : null;

  if (!decoded) return <div className="p-4">Aucun utilisateur connecté.</div>;

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Mon Profil</h1>
      <div className="card p-4 shadow-sm">
        <p><strong>Nom :</strong> {decoded.nom || "—"}</p>
        <p><strong>Email :</strong> {decoded.sub}</p>
        <p><strong>Rôle :</strong> {decoded.role}</p>
      </div>
    </div>
  );
}
