// src/pages/SecteursList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchSecteurs, deleteSecteur } from "../services/secteurService";
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

export default function SecteursList() {
  const [secteurs, setSecteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSecteur, setSelectedSecteur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadSecteurs();
  }, []);

  const loadSecteurs = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchSecteurs();
      setSecteurs(data);
    } catch (error) {
      console.error('Error fetching secteurs:', error);
      setError('Erreur lors de la récupération des secteurs');
      toast.error("Erreur lors du chargement des secteurs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteSecteur(id);
      toast.success("Secteur supprimé avec succès");
      loadSecteurs();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleView = secteur => {
    setSelectedSecteur(secteur);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSecteur(null);
  };

  const filteredSecteurs = secteurs.filter(secteur => {
    const searchTermLower = searchTerm.toLowerCase();
    return secteur.nom?.toLowerCase().includes(searchTermLower);
  });

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement des secteurs...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadSecteurs}>
            Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Secteurs</h2>
        <Link to="/secteurs/new" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nouveau Secteur
        </Link>
      </div>

      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher un secteur par nom..."
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

      {filteredSecteurs.length === 0 ? (
        <Alert variant="info">
          {searchTerm 
            ? "Aucun secteur ne correspond à votre recherche"
            : "Aucun secteur trouvé"}
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSecteurs.map(secteur => (
              <tr key={secteur.id}>
                <td>{secteur.nom}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(secteur)}
                    title="Voir"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  <Link
                    to={`/secteurs/${secteur.id}`}
                    className="btn btn-warning btn-sm me-2"
                    title="Modifier"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedSecteur(secteur);
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
          <Modal.Title>Détails du Secteur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSecteur && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>ID:</strong> {selectedSecteur.id}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Nom:</strong> {selectedSecteur.nom}
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
          Êtes-vous sûr de vouloir supprimer ce secteur ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(selectedSecteur?.id)}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
}
