// src/pages/EntitesList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchEntites, deleteEntite } from "../services/entiteService";
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

export default function EntitesList() {
  const [entites, setEntites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntite, setSelectedEntite] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadEntites();
  }, []);

  const loadEntites = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchEntites();
      setEntites(data);
    } catch (error) {
      console.error('Error fetching entities:', error);
      setError('Erreur lors de la récupération des entités');
      toast.error("Erreur lors du chargement des entités");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteEntite(id);
      toast.success("Entité supprimée avec succès");
      loadEntites();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleView = entite => {
    setSelectedEntite(entite);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEntite(null);
  };

  const filteredEntites = entites.filter(entite => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      entite.libelle?.toLowerCase().includes(searchTermLower) ||
      entite.typeEntreprise?.libelle?.toLowerCase().includes(searchTermLower) ||
      entite.adresse?.toLowerCase().includes(searchTermLower) ||
      entite.region?.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement des entités...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadEntites}>
            Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Entités</h2>
        <Link to="/entites/new" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nouvelle Entité
        </Link>
      </div>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher une entité par libellé, type, adresse ou région..."
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

      {filteredEntites.length === 0 ? (
        <Alert variant="info">
          {searchTerm 
            ? "Aucune entité ne correspond à votre recherche"
            : "Aucune entité trouvée"}
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Libellé</th>
              <th>Type</th>
              <th>Adresse</th>
              <th>Région</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntites.map(entite => (
              <tr key={entite.id}>
                <td>{entite.libelle}</td>
                <td>
                  <span className="badge bg-primary">
                    {entite.typeEntreprise?.libelle}
                  </span>
                </td>
                <td>{entite.adresse}</td>
                <td>{entite.region}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(entite)}
                    title="Voir"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  <Link
                    to={`/entites/${entite.id}`}
                    className="btn btn-warning btn-sm me-2"
                    title="Modifier"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedEntite(entite);
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
          <Modal.Title>Détails de l'Entité</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEntite && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>Libellé:</strong> {selectedEntite.libelle}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Type:</strong> {selectedEntite.typeEntreprise?.libelle}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Adresse:</strong> {selectedEntite.adresse}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Code Postal:</strong> {selectedEntite.codePostal}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Région:</strong> {selectedEntite.region}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Téléphone:</strong> {selectedEntite.telephone}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Fax:</strong> {selectedEntite.fax}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Email:</strong> {selectedEntite.email}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Source:</strong> {selectedEntite.source}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Effectif:</strong> {selectedEntite.effectif}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Forme Juridique:</strong> {selectedEntite.formeJuridique}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Capital Social:</strong> {selectedEntite.capitalSocial}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Date de Création:</strong>{" "}
                {new Date(selectedEntite.dateCreation).toLocaleDateString()}
              </div>
              <div className="col-12 mb-3">
                <strong>Activités:</strong>
                <p>{selectedEntite.activites}</p>
              </div>
              <div className="col-12 mb-3">
                <strong>Produits:</strong>
                <p>{selectedEntite.produits}</p>
              </div>
              <div className="col-12 mb-3">
                <strong>Présentation:</strong>
                <p>{selectedEntite.presentation}</p>
              </div>
              <div className="col-md-6 mb-3">
                <strong>Marque Représentée:</strong>{" "}
                {selectedEntite.marqueRepresentee}
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
          Êtes-vous sûr de vouloir supprimer cette entité ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(selectedEntite?.id)}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
}
