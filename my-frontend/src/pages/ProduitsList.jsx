// src/pages/ProduitsList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchProduits, deleteProduit } from "../services/produitService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEye,
  faEdit,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Container, Form, InputGroup, Alert, Modal, Button, Spinner } from 'react-bootstrap';

export default function ProduitsList() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadProduits();
  }, []);

  const loadProduits = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchProduits();
      setProduits(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Erreur lors de la récupération des produits');
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteProduit(id);
      toast.success("Produit supprimé avec succès");
      loadProduits();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleView = produit => {
    setSelectedProduit(produit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduit(null);
  };

  const filteredProduits = produits.filter(produit => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      produit.nom?.toLowerCase().includes(searchTermLower) ||
      produit.categorie?.toLowerCase().includes(searchTermLower) ||
      produit.description?.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement des produits...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadProduits}>
            Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Produits</h2>
        <Link to="/produits/new" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nouveau Produit
        </Link>
      </div>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher un produit par nom, catégorie ou description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button 
            variant="outline-secondary" 
            onClick={() => setSearchTerm('')}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        )}
      </InputGroup>

      {filteredProduits.length === 0 ? (
        <Alert variant="info">
          {searchTerm 
            ? "Aucun produit ne correspond à votre recherche"
            : "Aucun produit trouvé"}
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduits.map(produit => (
              <tr key={produit.id}>
                <td>{produit.nom}</td>
                <td>
                  <span className="badge bg-primary">
                    {produit.categorie}
                  </span>
                </td>
                <td>{produit.prix} €</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(produit)}
                    title="Voir"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  <Link
                    to={`/produits/${produit.id}`}
                    className="btn btn-warning btn-sm me-2"
                    title="Modifier"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedProduit(produit);
                      setShowDeleteModal(true);
                    }}
                    title="Supprimer"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal pour voir les détails */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails du Produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduit && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>Nom:</strong> {selectedProduit.nom}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Catégorie:</strong> {selectedProduit.categorie}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Prix:</strong> {selectedProduit.prix} €
              </div>
              <div className="col-12 mb-3">
                <strong>Description:</strong>
                <p>{selectedProduit.description}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer ce produit ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(selectedProduit?.id)}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
}
