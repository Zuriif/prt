// src/components/NavBar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/dashboard">Morocco T</NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user?.role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    Tableau de bord
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/users">
                    Gestion des Utilisateurs
                  </NavLink>
                </li>
                {["entites", "produits", "fonctionnaires", "media", "secteurs", "sous-secteurs", "type-entreprises"].map(path => (
                  <li className="nav-item" key={path}>
                    <NavLink className="nav-link" to={`/${path}`}>
                      {path.charAt(0).toUpperCase() + path.slice(1)}
                    </NavLink>
                  </li>
                ))}
              </>
            )}
            {user?.role === "USER" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/user/dashboard">
                    Tableau de bord
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/user/produits">
                    Produits
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/user/entites">
                    Entités
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            <span className="text-light me-3">
              {user?.nom} ({user?.role})
            </span>
            <button className="btn btn-outline-light" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
