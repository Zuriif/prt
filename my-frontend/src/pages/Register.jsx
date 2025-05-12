import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/axiosClient";
import { AuthContext } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: "",
    email: "",
    motDePasse: "",
    role: "USER"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await client.post("/api/auth/register", form);
      login(res.data.token);
      toast.success("Inscription réussie !");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body p-4">
          <h3 className="card-title text-center mb-4">Inscription</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nom" className="form-label">
                Nom complet
              </label>
              <input
                id="nom"
                type="text"
                className="form-control"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="motDePasse" className="form-label">
                Mot de passe
              </label>
              <input
                id="motDePasse"
                type="password"
                className="form-control"
                value={form.motDePasse}
                onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Inscription..." : "S'inscrire"}
            </button>
          </form>
          <div className="text-center mt-3">
            <small>
              Vous avez déjà un compte?{" "}
              <Link to="/login" className="link-primary">
                Connectez-vous
              </Link>
            </small>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
