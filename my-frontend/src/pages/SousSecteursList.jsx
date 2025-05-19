// src/pages/SousSecteursList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchSousSecteurs, deleteSousSecteur } from "../services/sousSecteurService";
import { fetchSecteurs } from "../services/secteurService";
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

export default function SousSecteursList() {
  const [sousSecteurs, setSousSecteurs] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSousSecteur, setSelectedSousSecteur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sousSecteursRes, secteursRes] = await Promise.all([
        fetchSousSecteurs(),
        fetchSecteurs()
      ]);
      setSousSecteurs(sousSecteursRes.data);
      setSecteurs(secteursRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Erreur lors de la récupération des données');
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteSousSecteur(id);
      toast.success("Sous-secteur supprimé avec succès");
      loadData();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleView = sousSecteur => {
    setSelectedSousSecteur(sousSecteur);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSousSecteur(null);
  };

  const filteredSousSecteurs = sousSecteurs.filter(sousSecteur => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      sousSecteur.nom?.toLowerCase().includes(searchTermLower) ||
      sousSecteur.secteur?.nom?.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement des sous-secteurs...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadData}>
            Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Sous-Secteurs</h2>
        <Link to="/sous-secteurs/new" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nouveau Sous-Secteur
        </Link>
      </div>

      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher un sous-secteur par nom ou secteur..."
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

      {filteredSousSecteurs.length === 0 ? (
        <Alert variant="info">
          {searchTerm 
            ? "Aucun sous-secteur ne correspond à votre recherche"
            : "Aucun sous-secteur trouvé"}
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Secteur</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSousSecteurs.map(sousSecteur => (
              <tr key={sousSecteur.id}>
                <td>{sousSecteur.nom}</td>
                <td>{sousSecteur.secteur?.nom || 'N/A'}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(sousSecteur)}
                    title="Voir"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  <Link
                    to={`/sous-secteurs/${sousSecteur.id}`}
                    className="btn btn-warning btn-sm me-2"
                    title="Modifier"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedSousSecteur(sousSecteur);
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
          <Modal.Title>Détails du Sous-Secteur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSousSecteur && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>ID:</strong> {selectedSousSecteur.id}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Nom:</strong> {selectedSousSecteur.nom}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Secteur:</strong> {selectedSousSecteur.secteur?.nom || 'N/A'}
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
          Êtes-vous sûr de vouloir supprimer ce sous-secteur ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(selectedSousSecteur?.id)}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
}