// src/pages/TypeEntreprisesList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchTypeEntreprises,
  deleteTypeEntreprise,
} from "../services/typeEntrepriseService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TypeEntreprisesList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchTypeEntreprises();
      setItems(res.data);
    } catch {
      toast.error("Erreur de chargement des types d’entreprise");
    } finally {
      setLoading(false);
    }
  }

  // Filtre + pagination
  const filtered = items.filter(t =>
    t.libelle.toLowerCase().includes(search.toLowerCase())
  );
  const totalItems = filtered.length;
  const pageCount = Math.ceil(totalItems / pageSize);
  const startIdx = (page - 1) * pageSize;
  const paged = filtered.slice(startIdx, startIdx + pageSize);

  // Sélection
  const allSelected =
    paged.length > 0 && paged.every(t => selectedIds.has(t.id));
  const toggleAll = () => {
    const s = new Set(selectedIds);
    if (allSelected) {
      paged.forEach(t => s.delete(t.id));
    } else {
      paged.forEach(t => s.add(t.id));
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
    if (!selectedIds.size) return;
    if (!window.confirm("Supprimer les types sélectionnés ?")) return;
    try {
      await Promise.all([...selectedIds].map(id => deleteTypeEntreprise(id)));
      toast.success("Types d’entreprise supprimés");
      setSelectedIds(new Set());
      load();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="container py-4">
      {/* Barre d’outils */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Gestion des types d’entreprise</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={!selectedIds.size}
            onClick={handleBulkDelete}
          >
            Supprimer sélection
          </button>
          <Link to="/type-entreprises/create" className="btn btn-success">
            + Nouveau type
          </Link>
        </div>
      </div>

      {/* Recherche */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par libellé..."
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
                <th>Libellé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(t => (
                <tr key={t.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(t.id)}
                      onChange={() => toggleOne(t.id)}
                    />
                  </td>
                  <td>{t.id}</td>
                  <td>{t.libelle}</td>
                  <td>
                    <Link
                      to={`/type-entreprises/${t.id}/edit`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      Éditer
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={async () => {
                        if (window.confirm("Supprimer ce type ?")) {
                          await deleteTypeEntreprise(t.id);
                          load();
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
