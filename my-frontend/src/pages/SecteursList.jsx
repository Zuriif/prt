// src/pages/SecteursList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchSecteurs, deleteSecteur } from "../services/secteurService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function SecteursList() {
  const [secteurs, setSecteurs] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedSecteur, setSelectedSecteur] = useState(null);

  useEffect(() => {
    loadSecteurs();
  }, []);

  const loadSecteurs = () => {
    fetchSecteurs()
      .then(({ data }) => setSecteurs(data))
      .catch(() => toast.error("Impossible de charger les secteurs"));
  };

  const handleDelete = async id => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce secteur ?")) {
      return;
    }
    try {
      await deleteSecteur(id);
      toast.success("Secteur supprimé");
      loadSecteurs();
    } catch {
      toast.error("Impossible de supprimer le secteur");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ces secteurs ?")) {
      return;
    }
    try {
      await Promise.all([...selectedIds].map(id => deleteSecteur(id)));
      toast.success("Secteurs supprimés");
      setSelectedIds(new Set());
      loadSecteurs();
    } catch {
      toast.error("Impossible de supprimer les secteurs");
    }
  };

  const toggleSelect = id => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === secteurs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(secteurs.map(e => e.id)));
    }
  };

  const handleView = (secteur) => {
    setSelectedSecteur(secteur);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSecteur(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Secteurs</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={!selectedIds.size}
            onClick={handleBulkDelete}
          >
            Delete
          </button>
          <Link to="/secteurs/new" className="btn btn-success">
            + Add New Secteur
          </Link>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedIds.size === secteurs.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {secteurs.map(e => (
                  <tr key={e.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(e.id)}
                        onChange={() => toggleSelect(e.id)}
                      />
                    </td>
                    <td>{e.id}</td>
                    <td>{e.nom}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleView(e)}
                      >
                        View
                      </button>
                      <Link
                        to={`/secteurs/${e.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(e.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />

      {/* Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails du Secteur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSecteur && (
            <div>
              <p><strong>ID:</strong> {selectedSecteur.id}</p>
              <p><strong>Nom:</strong> {selectedSecteur.nom}</p>
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
