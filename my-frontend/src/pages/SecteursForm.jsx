// src/pages/SecteurForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchSecteur,
  createSecteur,
  updateSecteur,
} from "../services/secteurService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SecteurForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const emptyForm = { nom: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isEdit) {
      fetchSecteur(id)
        .then(({ data }) => setForm(data))
        .catch(() => toast.error("Impossible de charger le secteur"));
    }
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateSecteur(id, form);
        toast.success("Secteur mis à jour");
      } else {
        await createSecteur(form);
        toast.success("Secteur créé");
      }
      navigate("/secteurs");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">
        {isEdit ? "Modifier un secteur" : "Créer un secteur"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            value={form.nom}
            onChange={e => setForm({ nom: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          {isEdit ? "Mettre à jour" : "Créer"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/secteurs")}
        >
          Annuler
        </button>
      </form>
      <ToastContainer position="top-center" />
    </div>
);
}
