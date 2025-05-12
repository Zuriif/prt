// src/pages/EntitesList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEntites, deleteEntite } from "../services/entiteService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function EntitesList() {
  const [entites, setEntites] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedEntite, setSelectedEntite] = useState(null);

  useEffect(() => {
    loadEntites();
  }, []);

  const loadEntites = () => {
    fetchEntites()
      .then(({ data }) => setEntites(data))
      .catch(() => toast.error("Impossible de charger les entités"));
  };

  const handleDelete = async id => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette entité ?")) {
      return;
    }
    try {
      await deleteEntite(id);
      toast.success("Entité supprimée");
      loadEntites();
    } catch {
      toast.error("Impossible de supprimer l'entité");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ces entités ?")) {
      return;
    }
    try {
      await Promise.all([...selectedIds].map(id => deleteEntite(id)));
      toast.success("Entités supprimées");
      setSelectedIds(new Set());
      loadEntites();
    } catch {
      toast.error("Impossible de supprimer les entités");
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
    if (selectedIds.size === entites.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(entites.map(e => e.id)));
    }
  };

  const handleView = (entite) => {
    setSelectedEntite(entite);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEntite(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Entités</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={!selectedIds.size}
            onClick={handleBulkDelete}
          >
            Delete
          </button>
          <Link to="/entites/new" className="btn btn-success">
            + Add New Entite
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
                      checked={selectedIds.size === entites.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>Libellé</th>
                  <th>Type</th>
                  <th>Adresse</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entites.map(e => (
                  <tr key={e.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(e.id)}
                        onChange={() => toggleSelect(e.id)}
                      />
                    </td>
                    <td>{e.id}</td>
                    <td>{e.libelle}</td>
                    <td>{e.typeEntreprise?.libelle}</td>
                    <td>{e.adresse}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleView(e)}
                      >
                        View
                      </button>
                      <Link
                        to={`/entites/${e.id}`}
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
          <Modal.Title>Détails de l'Entité</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEntite && (
            <div>
              <p><strong>ID:</strong> {selectedEntite.id}</p>
              <p><strong>Libellé:</strong> {selectedEntite.libelle}</p>
              <p><strong>Type:</strong> {selectedEntite.typeEntreprise?.libelle}</p>
              <p><strong>Adresse:</strong> {selectedEntite.adresse}</p>
              <p><strong>Code Postal:</strong> {selectedEntite.codePostal}</p>
              <p><strong>Région:</strong> {selectedEntite.region}</p>
              <p><strong>Téléphone:</strong> {selectedEntite.telephone}</p>
              <p><strong>Fax:</strong> {selectedEntite.fax}</p>
              <p><strong>Email:</strong> {selectedEntite.email}</p>
              <p><strong>Source:</strong> {selectedEntite.source}</p>
              <p><strong>Effectif:</strong> {selectedEntite.effectif}</p>
              <p><strong>Forme Juridique:</strong> {selectedEntite.formeJuridique}</p>
              <p><strong>Capital Social:</strong> {selectedEntite.capitalSocial}</p>
              <p><strong>Date Création:</strong> {selectedEntite.dateCreation}</p>
              <p><strong>Activités:</strong> {selectedEntite.activites}</p>
              <p><strong>Produits:</strong> {selectedEntite.produits}</p>
              <p><strong>Présentation:</strong> {selectedEntite.presentation}</p>
              <p><strong>Marque Représentée:</strong> {selectedEntite.marqueRepresentee}</p>
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
