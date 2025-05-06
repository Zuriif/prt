// src/pages/SousSecteurForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchSousSecteur,
  createSousSecteur,
  updateSousSecteur,
} from "../services/sousSecteurService";
import { fetchSecteurs } from "../services/secteurService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SousSecteurForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const emptyForm = { nom: "", secteurId: "" };
  const [form, setForm] = useState(emptyForm);
  const [secteurs, setSecteurs] = useState([]);

  useEffect(() => {
    fetchSecteurs().then(r => setSecteurs(r.data));
    if (isEdit) {
      fetchSousSecteur(id)
        .then(({ data }) =>
          setForm({
            nom: data.nom,
            secteurId: data.secteur?.id || "",
          })
        )
        .catch(() => toast.error("Impossible de charger le sous-secteur"));
    }
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      nom: form.nom,
      secteur: form.secteurId ? { id: Number(form.secteurId) } : null,
    };
    try {
      if (isEdit) {
        await updateSousSecteur(id, payload);
        toast.success("Sous-secteur mis à jour");
      } else {
        await createSousSecteur(payload);
        toast.success("Sous-secteur créé");
      }
      navigate("/sous-secteurs");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">
        {isEdit ? "Modifier un sous-secteur" : "Créer un sous-secteur"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            value={form.nom}
            onChange={e => setForm({ ...form, nom: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Secteur</label>
          <select
            className="form-select"
            value={form.secteurId}
            onChange={e => setForm({ ...form, secteurId: e.target.value })}
            required
          >
            <option value="">— Choisir un secteur —</option>
            {secteurs.map(s => (
              <option key={s.id} value={s.id}>
                {s.nom}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary me-2">
          {isEdit ? "Mettre à jour" : "Créer"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/sous-secteurs")}
        >
          Annuler
        </button>
      </form>
      <ToastContainer position="top-center" />
    </div>
);
}
