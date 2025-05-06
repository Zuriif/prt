// src/pages/ProduitForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProduit,
  createProduit,
  updateProduit,
} from "../services/produitService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProduitForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const emptyForm = {
    nom: "",
    description: "",
    categorie: "",
    prix: "",
    entiteId: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isEdit) {
      fetchProduit(id)
        .then(({ data }) => setForm(data))
        .catch(() => toast.error("Impossible de charger le produit"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateProduit(id, form);
        toast.success("Produit mis à jour");
      } else {
        await createProduit(form);
        toast.success("Produit créé");
      }
      navigate("/produits");
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">
        {isEdit ? "Modifier un produit" : "Créer un produit"}
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
            <label className="form-label">Catégorie</label>
            <input
              type="text"
              className="form-control"
              value={form.categorie}
              onChange={(e) =>
                setForm({ ...form, categorie: e.target.value })
              }
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Prix</label>
            <input
              type="number"
              className="form-control"
              value={form.prix}
              onChange={(e) => setForm({ ...form, prix: e.target.value })}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Entité (ID)</label>
            <input
              type="number"
              className="form-control"
              value={form.entiteId}
              onChange={(e) =>
                setForm({ ...form, entiteId: e.target.value })
              }
            />
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
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
            onClick={() => navigate("/produits")}
          >
            Annuler
          </button>
        </div>
      </form>
      <ToastContainer position="top-center" />
    </div>
  );
}
