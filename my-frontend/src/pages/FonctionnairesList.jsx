// src/pages/FonctionnairesList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchFonctionnaires,
  deleteFonctionnaire,
} from "../services/fonctionnaireService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FonctionnairesList() {
  const [list, setList] = useState([]);
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
      const res = await fetchFonctionnaires();
      setList(res.data);
    } catch {
      toast.error("Erreur de chargement des fonctionnaires");
    } finally {
      setLoading(false);
    }
  }

  // Filtrage & pagination
  const filtered = list.filter(f =>
    (`${f.nom} ${f.prenom}`).toLowerCase().includes(search.toLowerCase())
  );
  const totalItems = filtered.length;
  const pageCount = Math.ceil(totalItems / pageSize);
  const startIdx = (page - 1) * pageSize;
  const paged = filtered.slice(startIdx, startIdx + pageSize);

  // Sélection multiple
  const allSelected =
    paged.length > 0 && paged.every(f => selectedIds.has(f.id));
  const toggleAll = () => {
    const s = new Set(selectedIds);
    if (allSelected) {
      paged.forEach(f => s.delete(f.id));
    } else {
      paged.forEach(f => s.add(f.id));
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
    if (!window.confirm("Supprimer les fonctionnaires sélectionnés ?")) return;
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => deleteFonctionnaire(id))
      );
      toast.success("Fonctionnaires supprimés");
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
        <h1 className="h3">Gestion des fonctionnaires</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={selectedIds.size === 0}
            onClick={handleBulkDelete}
          >
            Supprimer sélection
          </button>
          <Link to="/fonctionnaires/create" className="btn btn-success">
            + Nouveau fonctionnaire
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par nom/prénom..."
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
                <th>Prénom</th>
                <th>Email</th>
                <th>GSM</th>
                <th>Profil</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(f => (
                <tr key={f.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(f.id)}
                      onChange={() => toggleOne(f.id)}
                    />
                  </td>
                  <td>{f.id}</td>
                  <td>{f.nom}</td>
                  <td>{f.prenom}</td>
                  <td>{f.email}</td>
                  <td>{f.gsm}</td>
                  <td>{f.profil}</td>
                  <td>
                    <Link
                      to={`/fonctionnaires/${f.id}/edit`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      Éditer
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={async () => {
                        if (window.confirm("Supprimer ce fonctionnaire ?")) {
                          await deleteFonctionnaire(f.id);
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
                <button className="page-link" onClick={() => setPage(i + 1)}>
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
