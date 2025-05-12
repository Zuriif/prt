// src/pages/MediaForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMediaById, createMedia, updateMedia } from "../services/mediaService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MediaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const empty = {
    nomFichier: "",
    url: "",
    description: "",
  };

  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (isEdit) {
      fetchMediaById(id)
        .then(({ data }) => {
          setForm({
            ...data,
            description: data.description || "",
          });
        })
        .catch(() => toast.error("Impossible de charger le média"));
    }
  }, [id, isEdit]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
      };
      if (isEdit) {
        await updateMedia(id, payload);
        toast.success("Média mis à jour");
      } else {
        await createMedia(payload);
        toast.success("Média créé");
      }
      navigate("/media");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du média");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">
        {isEdit ? "Modifier le média" : "Nouveau média"}
      </h1>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nom du fichier</label>
              <input
                type="text"
                className="form-control"
                value={form.nomFichier}
                onChange={e => setForm({ ...form, nomFichier: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">URL</label>
              <input
                type="text"
                className="form-control"
                value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows="3"
                placeholder="Ajouter une description ou une actualité liée à l'image..."
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                {isEdit ? "Mettre à jour" : "Créer"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/media")}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
