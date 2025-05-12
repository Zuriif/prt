import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../../style/Dashboard.css';
import { AuthContext } from '../../contexts/AuthContext';

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-root" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* User Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ borderBottom: '4px solid #c0392b' }}>
        <div className="container-fluid">
          <NavLink className="navbar-brand fw-bold" to="/user/dashboard">Morocco T</NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#usernav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="usernav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/user/dashboard">Accueil</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/user/produits">Produits</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/user/entites">Entités</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/user/secteurs">Secteurs</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/user/compte">Mon compte</NavLink>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <span className="text-light me-3">
                {user?.nom} ({user?.role})
              </span>
              <Button className="btn btn-primary" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
};

export default UserLayout; 