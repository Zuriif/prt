// src/pages/ProduitsList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProduits, deleteProduit } from "../services/produitService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProduitsList() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    loadProduits();
  }, []);

  async function loadProduits() {
    setLoading(true);
    try {
      const res = await fetchProduits();
      setProduits(res.data);
    } catch {
      toast.error("Erreur de chargement des produits");
    } finally {
      setLoading(false);
    }
  }

  // Filtrer & paginer
  const filtered = produits.filter(p =>
    p.nom.toLowerCase().includes(search.toLowerCase())
  );
  const totalItems = filtered.length;
  const pageCount = Math.ceil(totalItems / pageSize);
  const startIdx = (page - 1) * pageSize;
  const paged = filtered.slice(startIdx, startIdx + pageSize);

  // Sélection multiple
  const allSelected = paged.length > 0 && paged.every(p => selectedIds.has(p.id));
  const toggleAll = () => {
    const s = new Set(selectedIds);
    if (allSelected) {
      paged.forEach(p => s.delete(p.id));
    } else {
      paged.forEach(p => s.add(p.id));
    }
    setSelectedIds(s);
  };
  const toggleOne = id => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  // Suppression en masse
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm("Supprimer les produits sélectionnés ?")) return;
    try {
      await Promise.all([...selectedIds].map(id => deleteProduit(id)));
      toast.success("Produits supprimés");
      setSelectedIds(new Set());
      loadProduits();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="container py-4">
      {/* Barre d’outils */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Gestion des produits</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={selectedIds.size === 0}
            onClick={handleBulkDelete}
          >
            Supprimer sélection
          </button>
          <Link to="/produits/create" className="btn btn-success">
            + Nouveau produit
          </Link>
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par nom..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Tableau */}
      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th>ID</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(p => (
                <tr key={p.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleOne(p.id)}
                    />
                  </td>
                  <td>{p.id}</td>
                  <td>{p.nom}</td>
                  <td>{p.categorie}</td>
                  <td>{p.prix}</td>
                  <td>
                    <Link
                      to={`/produits/${p.id}/edit`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      Éditer
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={async () => {
                        if (window.confirm("Supprimer ce produit ?")) {
                          await deleteProduit(p.id);
                          loadProduits();
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          {startIdx + 1}–{startIdx + paged.length} sur {totalItems}
        </small>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${page === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
              >
                Précédent
              </button>
            </li>
            {[...Array(pageCount)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 && "active"}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === pageCount && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setPage(p => Math.min(p + 1, pageCount))}
              >
                Suivant
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <ToastContainer position="top-center" />
    </div>
);
}
