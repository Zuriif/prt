// src/pages/ProduitsList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProduits, deleteProduit } from "../services/produitService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function ProduitsList() {
  const [produits, setProduits] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);

  useEffect(() => {
    loadProduits();
  }, []);

  const loadProduits = () => {
    fetchProduits()
      .then(({ data }) => setProduits(data))
      .catch(() => toast.error("Impossible de charger les produits"));
  };

  const handleDelete = async id => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }
    try {
      await deleteProduit(id);
      toast.success("Produit supprimé");
      loadProduits();
    } catch {
      toast.error("Impossible de supprimer le produit");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ces produits ?")) {
      return;
    }
    try {
      await Promise.all([...selectedIds].map(id => deleteProduit(id)));
      toast.success("Produits supprimés");
      setSelectedIds(new Set());
      loadProduits();
    } catch {
      toast.error("Impossible de supprimer les produits");
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
    if (selectedIds.size === produits.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(produits.map(p => p.id)));
    }
  };

  const handleView = (produit) => {
    setSelectedProduit(produit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduit(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Produits</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={!selectedIds.size}
            onClick={handleBulkDelete}
          >
            Delete
          </button>
          <Link to="/produits/new" className="btn btn-success">
            + Add New Product
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
                      checked={selectedIds.size === produits.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Entité ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {produits.map(p => (
                  <tr key={p.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                      />
                    </td>
                    <td>{p.id}</td>
                    <td>{p.nom}</td>
                    <td>{p.description}</td>
                    <td>{p.categorie}</td>
                    <td>{p.prix}</td>
                    <td>{p.entiteId}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleView(p)}
                      >
                        View
                      </button>
                      <Link
                        to={`/produits/${p.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(p.id)}
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
          <Modal.Title>Détails du Produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduit && (
            <div>
              <p><strong>ID:</strong> {selectedProduit.id}</p>
              <p><strong>Nom:</strong> {selectedProduit.nom}</p>
              <p><strong>Description:</strong> {selectedProduit.description}</p>
              <p><strong>Catégorie:</strong> {selectedProduit.categorie}</p>
              <p><strong>Prix:</strong> {selectedProduit.prix}</p>
              <p><strong>Entité ID:</strong> {selectedProduit.entiteId}</p>
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
