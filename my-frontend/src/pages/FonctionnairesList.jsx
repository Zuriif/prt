// src/pages/FonctionnairesList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchFonctionnaires,
  deleteFonctionnaire,
} from "../services/fonctionnaireService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function FonctionnairesList() {
  const [fonctionnaires, setFonctionnaires] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedFonctionnaire, setSelectedFonctionnaire] = useState(null);

  useEffect(() => {
    loadFonctionnaires();
  }, []);

  const loadFonctionnaires = () => {
    fetchFonctionnaires()
      .then(({ data }) => setFonctionnaires(data))
      .catch(() => toast.error("Impossible de charger les fonctionnaires"));
  };

  const handleDelete = async id => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce fonctionnaire ?")) {
      return;
    }
    try {
      await deleteFonctionnaire(id);
      toast.success("Fonctionnaire supprimé");
      loadFonctionnaires();
    } catch {
      toast.error("Impossible de supprimer le fonctionnaire");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ces fonctionnaires ?")) {
      return;
    }
    try {
      await Promise.all([...selectedIds].map(id => deleteFonctionnaire(id)));
      toast.success("Fonctionnaires supprimés");
      setSelectedIds(new Set());
      loadFonctionnaires();
    } catch {
      toast.error("Impossible de supprimer les fonctionnaires");
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
    if (selectedIds.size === fonctionnaires.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(fonctionnaires.map(e => e.id)));
    }
  };

  const handleView = (fonctionnaire) => {
    setSelectedFonctionnaire(fonctionnaire);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFonctionnaire(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Fonctionnaires</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={!selectedIds.size}
            onClick={handleBulkDelete}
          >
            Delete
          </button>
          <Link to="/fonctionnaires/new" className="btn btn-success">
            + Add New Fonctionnaire
          </Link>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedIds.size === fonctionnaires.length}
                      onChange={toggleSelectAll}
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
                {fonctionnaires.map(f => (
                  <tr key={f.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(f.id)}
                        onChange={() => toggleSelect(f.id)}
                      />
                    </td>
                    <td>{f.id}</td>
                    <td>{f.nom}</td>
                    <td>{f.prenom}</td>
                    <td>{f.email}</td>
                    <td>{f.gsm}</td>
                    <td>{f.profil}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleView(f)}
                      >
                        View
                      </button>
                      <Link
                        to={`/fonctionnaires/${f.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(f.id)}
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
          <Modal.Title>Détails du Fonctionnaire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFonctionnaire && (
            <div>
              <p><strong>ID:</strong> {selectedFonctionnaire.id}</p>
              <p><strong>Nom:</strong> {selectedFonctionnaire.nom}</p>
              <p><strong>Prénom:</strong> {selectedFonctionnaire.prenom}</p>
              <p><strong>Email:</strong> {selectedFonctionnaire.email}</p>
              <p><strong>GSM:</strong> {selectedFonctionnaire.gsm}</p>
              <p><strong>Entite:</strong> {selectedFonctionnaire.profil}</p>
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
