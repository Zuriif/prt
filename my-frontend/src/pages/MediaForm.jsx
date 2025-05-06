// src/pages/MediaForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadMedia } from "../services/mediaService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MediaForm() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [entiteId, setEntiteId] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    if (!file) {
      toast.error("Veuillez sélectionner un fichier");
      return;
    }
    try {
      await uploadMedia(file, entiteId);
      toast.success("Média uploadé");
      navigate("/media");
    } catch {
      toast.error("Erreur lors de l'upload");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Ajouter un média</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Fichier</label>
          <input
            type="file"
            className="form-control"
            onChange={e => setFile(e.target.files[0])}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Entité (ID)</label>
          <input
            type="number"
            className="form-control"
            value={entiteId}
            onChange={e => setEntiteId(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary me-2">
          Uploader
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/media")}
        >
          Annuler
        </button>
      </form>
      <ToastContainer position="top-center" />
    </div>
);
}
