// src/pages/FonctionnaireForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchFonctionnaire,
  createFonctionnaire,
  updateFonctionnaire,
} from "../services/fonctionnaireService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FonctionnaireForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const emptyForm = {
    nom: "",
    prenom: "",
    email: "",
    gsm: "",
    profil: "",
    entiteId: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isEdit) {
      fetchFonctionnaire(id)
        .then(({ data }) => setForm(data))
        .catch(() => toast.error("Impossible de charger le fonctionnaire"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateFonctionnaire(id, form);
        toast.success("Fonctionnaire mis à jour");
      } else {
        await createFonctionnaire(form);
        toast.success("Fonctionnaire créé");
      }
      navigate("/fonctionnaires");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">
        {isEdit ? "Modifier un fonctionnaire" : "Créer un fonctionnaire"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-sm-6">
            <label className="form-label">Nom</label>
            <input
              type="text"
              className="form-control"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Prénom</label>
            <input
              type="text"
              className="form-control"
              value={form.prenom}
              onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">GSM</label>
            <input
              type="tel"
              className="form-control"
              value={form.gsm}
              onChange={(e) => setForm({ ...form, gsm: e.target.value })}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Profil</label>
            <input
              type="text"
              className="form-control"
              value={form.profil}
              onChange={(e) => setForm({ ...form, profil: e.target.value })}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Entité (ID)</label>
            <input
              type="number"
              className="form-control"
              value={form.entiteId}
              onChange={(e) => setForm({ ...form, entiteId: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4">
          <button type="submit" className="btn btn-primary me-2">
            {isEdit ? "Mettre à jour" : "Créer"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/fonctionnaires")}
          >
            Annuler
          </button>
        </div>
      </form>
      <ToastContainer position="top-center" />
    </div>
);
}
