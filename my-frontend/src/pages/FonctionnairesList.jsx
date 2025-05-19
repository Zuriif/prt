// src/pages/FonctionnairesList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFonctionnaires, deleteFonctionnaire } from "../services/fonctionnaireService";
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

export default function FonctionnairesList() {
  const [fonctionnaires, setFonctionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFonctionnaire, setSelectedFonctionnaire] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadFonctionnaires();
  }, []);

  const loadFonctionnaires = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchFonctionnaires();
      setFonctionnaires(data);
    } catch (error) {
      console.error('Error fetching fonctionnaires:', error);
      setError('Erreur lors de la récupération des fonctionnaires');
      toast.error("Erreur lors du chargement des fonctionnaires");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteFonctionnaire(id);
      toast.success("Fonctionnaire supprimé avec succès");
      loadFonctionnaires();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleView = fonctionnaire => {
    setSelectedFonctionnaire(fonctionnaire);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFonctionnaire(null);
  };

  const filteredFonctionnaires = fonctionnaires.filter(fonctionnaire => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      fonctionnaire.nom?.toLowerCase().includes(searchTermLower) ||
      fonctionnaire.prenom?.toLowerCase().includes(searchTermLower) ||
      fonctionnaire.email?.toLowerCase().includes(searchTermLower) ||
      fonctionnaire.profil?.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement des fonctionnaires...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadFonctionnaires}>
            Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Fonctionnaires</h2>
        <Link to="/fonctionnaires/new" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nouveau Fonctionnaire
        </Link>
      </div>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher un fonctionnaire par nom, prénom, email ou profil..."
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

      {filteredFonctionnaires.length === 0 ? (
        <Alert variant="info">
          {searchTerm 
            ? "Aucun fonctionnaire ne correspond à votre recherche"
            : "Aucun fonctionnaire trouvé"}
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Profil</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFonctionnaires.map(fonctionnaire => (
              <tr key={fonctionnaire.id}>
                <td>{fonctionnaire.nom}</td>
                <td>{fonctionnaire.prenom}</td>
                <td>{fonctionnaire.email}</td>
                <td>
                  <span className="badge bg-primary">
                    {fonctionnaire.profil}
                  </span>
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(fonctionnaire)}
                    title="Voir"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  <Link
                    to={`/fonctionnaires/${fonctionnaire.id}`}
                    className="btn btn-warning btn-sm me-2"
                    title="Modifier"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedFonctionnaire(fonctionnaire);
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
          <Modal.Title>Détails du Fonctionnaire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFonctionnaire && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>Nom:</strong> {selectedFonctionnaire.nom}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Prénom:</strong> {selectedFonctionnaire.prenom}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Email:</strong> {selectedFonctionnaire.email}
              </div>
              <div className="col-md-6 mb-3">
                <strong>GSM:</strong> {selectedFonctionnaire.gsm}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Profil:</strong> {selectedFonctionnaire.profil}
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
          Êtes-vous sûr de vouloir supprimer ce fonctionnaire ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(selectedFonctionnaire?.id)}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
}
