// src/pages/ProduitsForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProduit,
  createProduit,
  updateProduit,
} from "../services/produitService";
import { fetchEntites } from "../services/entiteService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProduitsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const empty = {
    nom: "",
    description: "",
    categorie: "",
    prix: 0,
    entiteId: "",
  };

  const [form, setForm] = useState(empty);
  const [entites, setEntites] = useState([]);

  useEffect(() => {
    fetchEntites().then(r => setEntites(r.data));
    if (isEdit) {
      fetchProduit(id)
        .then(({ data }) => {
          setForm({
            ...data,
            entiteId: data.entiteId || "",
          });
        })
        .catch(() => toast.error("Impossible de charger le produit"));
    }
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        prix: Number(form.prix),
        entiteId: Number(form.entiteId)
      };

      if (isEdit) {
        await updateProduit(id, payload);
        toast.success("Produit mis à jour");
      } else {
        await createProduit(payload);
        toast.success("Produit créé");
      }
      navigate("/produits");
    } catch (error) {
      console.error('Error saving produit:', error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">
        {isEdit ? "Modifier le produit" : "Nouveau produit"}
      </h1>
      <div className="card shadow-sm">
        <div className="card-body">
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
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Catégorie</label>
              <input
                type="text"
                className="form-control"
                value={form.categorie}
                onChange={e => setForm({ ...form, categorie: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Prix</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                value={form.prix}
                onChange={e => setForm({ ...form, prix: e.target.value })}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Entité</label>
              <select
                className="form-select"
                value={form.entiteId}
                onChange={e => setForm({ ...form, entiteId: e.target.value })}
                required
              >
                <option value="">Sélectionner une entité</option>
                {entites.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.libelle}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
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
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
