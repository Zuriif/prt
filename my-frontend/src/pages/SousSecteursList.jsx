// src/pages/SousSecteursList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchSousSecteurs,
  deleteSousSecteur,
} from "../services/sousSecteurService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SousSecteursList() {
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
      const res = await fetchSousSecteurs();
      setItems(res.data);
    } catch {
      toast.error("Erreur de chargement des sous-secteurs");
    } finally {
      setLoading(false);
    }
  }

  // Filtre + pagination
  const filtered = items.filter(s =>
    s.nom.toLowerCase().includes(search.toLowerCase())
  );
  const totalItems = filtered.length;
  const pageCount = Math.ceil(totalItems / pageSize);
  const startIdx = (page - 1) * pageSize;
  const paged = filtered.slice(startIdx, startIdx + pageSize);

  // Sélection
  const allSelected =
    paged.length > 0 && paged.every(s => selectedIds.has(s.id));
  const toggleAll = () => {
    const s = new Set(selectedIds);
    if (allSelected) {
      paged.forEach(sec => s.delete(sec.id));
    } else {
      paged.forEach(sec => s.add(sec.id));
    }
    setSelectedIds(s);
  };
  const toggleOne = id => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (!selectedIds.size) return;
    if (!window.confirm("Supprimer les sous-secteurs sélectionnés ?")) return;
    try {
      await Promise.all([...selectedIds].map(id => deleteSousSecteur(id)));
      toast.success("Sous-secteurs supprimés");
      setSelectedIds(new Set());
      load();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="container py-4">
      {/* Toolbar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Gestion des sous-secteurs</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={!selectedIds.size}
            onClick={handleBulkDelete}
          >
            Supprimer sélection
          </button>
          <Link to="/sous-secteurs/create" className="btn btn-success">
            + Nouveau sous-secteur
          </Link>
        </div>
      </div>

      {/* Search */}
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

      {/* Table */}
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
                <th>Secteur ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(s => (
                <tr key={s.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(s.id)}
                      onChange={() => toggleOne(s.id)}
                    />
                  </td>
                  <td>{s.id}</td>
                  <td>{s.nom}</td>
                  <td>{s.secteur?.id}</td>
                  <td>
                    <Link
                      to={`/sous-secteurs/${s.id}/edit`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      Éditer
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={async () => {
                        if (window.confirm("Supprimer ce sous-secteur ?")) {
                          await deleteSousSecteur(s.id);
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
