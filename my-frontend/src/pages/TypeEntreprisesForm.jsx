// src/pages/TypeEntrepriseForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTypeEntreprise,
  createTypeEntreprise,
  updateTypeEntreprise,
} from "../services/typeEntrepriseService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TypeEntrepriseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const emptyForm = { libelle: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isEdit) {
      fetchTypeEntreprise(id)
        .then(({ data }) => setForm(data))
        .catch(() => toast.error("Impossible de charger le type"));
    }
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateTypeEntreprise(id, form);
        toast.success("Type mis à jour");
      } else {
        await createTypeEntreprise(form);
        toast.success("Type créé");
      }
      navigate("/type-entreprises");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">
        {isEdit ? "Modifier un type d’entreprise" : "Créer un type d’entreprise"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Libellé</label>
          <input
            type="text"
            className="form-control"
            value={form.libelle}
            onChange={e => setForm({ libelle: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          {isEdit ? "Mettre à jour" : "Créer"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/type-entreprises")}
        >
          Annuler
        </button>
      </form>
      <ToastContainer position="top-center" />
    </div>
);
}
