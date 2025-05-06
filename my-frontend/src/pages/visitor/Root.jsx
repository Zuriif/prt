import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Root() {
  const { token, user } = useContext(AuthContext);

  return (
    <div className="container py-4 text-center">
      <h1 className="mb-3">Bienvenue sur notre plateforme</h1>
      <p className="mb-4">Ceci est la page d’accueil pour les visiteurs.</p>

      {token ? (
        <p className="text-success">
          Bonjour {user?.nom || "utilisateur"}, vous êtes connecté !
          <br />
          <Link to="/dashboard" className="btn btn-primary mt-3">
            Accéder au tableau de bord
          </Link>
        </p>
      ) : (
        <div className="d-flex justify-content-center gap-3">
          <Link to="/login" className="btn btn-primary">Se connecter</Link>
          <Link to="/register" className="btn btn-secondary">Créer un compte</Link>
        </div>
      )}
    </div>
  );
}
