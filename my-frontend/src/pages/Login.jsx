// src/pages/Login.jsx
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import client from "../api/axiosClient";
import { AuthContext } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", motDePasse: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await client.post("/api/auth/login", form);
      login(res.data.token);
      toast.success("Connecté avec succès !");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Échec de la connexion : identifiants invalides");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title mb-4 text-center">Connexion</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Votre email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Votre mot de passe"
                    value={form.motDePasse}
                    onChange={(e) =>
                      setForm({ ...form, motDePasse: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Se connecter
                </button>
              </form>
              <p className="mt-3 text-center">
                Pas encore inscrit ?{' '}
                <Link to="/register">Créer un compte</Link>
              </p>
              <div className="text-center mt-2">
                <Link to="/">
                  <button className="btn btn-outline-secondary">
                    Retour à l'accueil visiteurs
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
