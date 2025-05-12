// src/pages/SousSecteursList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchSousSecteurs,
  deleteSousSecteur,
} from "../services/sousSecteurService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function SousSecteursList() {
  const [sousSecteurs, setSousSecteurs] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedSousSecteur, setSelectedSousSecteur] = useState(null);

  useEffect(() => {
    loadSousSecteurs();
  }, []);

  const loadSousSecteurs = () => {
    fetchSousSecteurs()
      .then(({ data }) => setSousSecteurs(data))
      .catch(() => toast.error("Impossible de charger les sous-secteurs"));
  };

  const handleDelete = async id => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce sous-secteur ?")) {
      return;
    }
    try {
      await deleteSousSecteur(id);
      toast.success("Sous-secteur supprimé");
      loadSousSecteurs();
    } catch {
      toast.error("Impossible de supprimer le sous-secteur");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ces sous-secteurs ?")) {
      return;
    }
    try {
      await Promise.all([...selectedIds].map(id => deleteSousSecteur(id)));
      toast.success("Sous-secteurs supprimés");
      setSelectedIds(new Set());
      loadSousSecteurs();
    } catch {
      toast.error("Impossible de supprimer les sous-secteurs");
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
    if (selectedIds.size === sousSecteurs.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sousSecteurs.map(e => e.id)));
    }
  };

  const handleView = (sousSecteur) => {
    setSelectedSousSecteur(sousSecteur);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSousSecteur(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Sous-secteurs</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={!selectedIds.size}
            onClick={handleBulkDelete}
          >
            Delete
          </button>
          <Link to="/sous-secteurs/new" className="btn btn-success">
            + Add New Sous-secteur
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
                      checked={selectedIds.size === sousSecteurs.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>Libellé</th>
                  <th>Secteur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sousSecteurs.map(e => (
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
                    <td>{e.secteur?.nom}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleView(e)}
                      >
                        View
                      </button>
                      <Link
                        to={`/sous-secteurs/${e.id}`}
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
          <Modal.Title>Détails du Sous-secteur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSousSecteur && (
            <div>
              <p><strong>ID:</strong> {selectedSousSecteur.id}</p>
              <p><strong>Nom:</strong> {selectedSousSecteur.nom}</p>
              <p><strong>Secteur:</strong> {selectedSousSecteur.secteur?.nom}</p>
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
