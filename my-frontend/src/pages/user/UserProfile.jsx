import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { token, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const decoded = token ? jwtDecode(token) : null;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: decoded?.nom || "",
    email: decoded?.sub || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [initialEmail] = useState(decoded?.sub || "");

  if (!decoded) return <div className="p-4">Aucun utilisateur connecté.</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await updateUser({
        nom: formData.nom,
        email: formData.email,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
      // If email was changed, force logout and redirect to login
      if (formData.email !== initialEmail) {
        toast.info("Votre email a changé. Veuillez vous reconnecter.");
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h3 mb-0">Mon Profil</h1>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? "Annuler" : "Modifier"}
                </button>
              </div>

              {!isEditing ? (
                <div>
                  <p><strong>Nom :</strong> {decoded.nom || "—"}</p>
                  <p><strong>Email :</strong> {decoded.sub}</p>
                  <p><strong>Rôle :</strong> {decoded.role}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <hr className="my-4" />
                  <h4>Changer le mot de passe</h4>

                  <div className="mb-3">
                    <label className="form-label">Mot de passe actuel</label>
                    <input
                      type="password"
                      className="form-control"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nouveau mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-success">
                    Enregistrer les modifications
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
} 