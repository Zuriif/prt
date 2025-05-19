// src/pages/TypeEntreprisesList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchTypeEntreprises,
  deleteTypeEntreprise,
} from "../services/typeEntrepriseService";
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

export default function TypeEntreprisesList() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchTypeEntreprises();
      setTypes(data);
    } catch (error) {
      console.error('Error fetching types:', error);
      setError('Erreur lors de la récupération des types');
      toast.error("Erreur lors du chargement des types");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteTypeEntreprise(id);
      toast.success("Type supprimé avec succès");
      loadTypes();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleView = type => {
    setSelectedType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedType(null);
  };

  const filteredTypes = types.filter(type => {
    const searchTermLower = searchTerm.toLowerCase();
    return type.libelle?.toLowerCase().includes(searchTermLower);
  });

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement des types...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadTypes}>
            Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Types d'Entreprise</h2>
        <Link to="/type-entreprises/new" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nouveau Type
        </Link>
      </div>

      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher un type par libellé..."
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

      {filteredTypes.length === 0 ? (
        <Alert variant="info">
          {searchTerm 
            ? "Aucun type ne correspond à votre recherche"
            : "Aucun type trouvé"}
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Libellé</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTypes.map(type => (
              <tr key={type.id}>
                <td>{type.libelle}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(type)}
                    title="Voir"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  <Link
                    to={`/type-entreprises/${type.id}`}
                    className="btn btn-warning btn-sm me-2"
                    title="Modifier"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedType(type);
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
          <Modal.Title>Détails du Type d'Entreprise</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedType && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>ID:</strong> {selectedType.id}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Libellé:</strong> {selectedType.libelle}
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
          Êtes-vous sûr de vouloir supprimer ce type ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(selectedType?.id)}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
}