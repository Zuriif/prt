// src/pages/TypeEntreprisesList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchTypeEntreprises,
  deleteTypeEntreprise,
} from "../services/typeEntrepriseService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function TypeEntreprisesList() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = () => {
    setLoading(true);
    fetchTypeEntreprises()
      .then(({ data }) => {
        setTypes(data);
      })
      .catch(() => toast.error("Impossible de charger les types d'entreprise"))
      .finally(() => setLoading(false));
  };

  // Filtre + pagination
  const filtered = types.filter(t =>
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
    if (selectedIds.size === types.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(types.map(t => t.id)));
    }
  };
  const toggleOne = id => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  // Suppression en masse
  const handleBulkDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ces types ?")) {
      return;
    }
    try {
      await Promise.all([...selectedIds].map(id => deleteTypeEntreprise(id)));
      toast.success("Types supprimés");
      setSelectedIds(new Set());
      load();
    } catch {
      toast.error("Impossible de supprimer les types");
    }
  };

  const handleView = (type) => {
    setSelectedType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedType(null);
  };

  return (
    <div className="container py-4">
      {/* Barre d'outils */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Types d'entreprise</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={!selectedIds.size}
            onClick={handleBulkDelete}
          >
            Delete
          </button>
          <Link to="/type-entreprises/new" className="btn btn-success">
            + Add New Type
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
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleView(t)}
                    >
                      View
                    </button>
                    <Link
                      to={`/type-entreprises/${t.id}`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      Edit
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

      {/* Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails du Type d'entreprise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedType && (
            <div>
              <p><strong>ID:</strong> {selectedType.id}</p>
              <p><strong>Libellé:</strong> {selectedType.libelle}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
