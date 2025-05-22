// src/pages/TypeEntreprisesList.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Container, Form, InputGroup, Alert, Modal, Button, Spinner } from 'react-bootstrap';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Space, Tag } from 'antd';

export default function TypeEntreprisesList() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

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
    return type.nom?.toLowerCase().includes(searchTermLower) ||
           type.description?.toLowerCase().includes(searchTermLower);
  });

  const columns = [
    {
      name: 'Nom',
      selector: row => row.nom,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Entite',
      selector: row => row.hasEntite,
      sortable: true,
      cell: row => (
        <div className="text-center">
          <FontAwesomeIcon 
            icon={row.hasEntite ? faCheck : faXmark} 
            className={row.hasEntite ? "text-success" : "text-danger"}
          />
        </div>
      ),
    },
    {
      name: 'Business',
      selector: row => row.hasBusiness,
      sortable: true,
      cell: row => (
        <div className="text-center">
          <FontAwesomeIcon 
            icon={row.hasBusiness ? faCheck : faXmark} 
            className={row.hasBusiness ? "text-success" : "text-danger"}
          />
        </div>
      ),
    },
    {
      name: 'Contact',
      selector: row => row.hasContact,
      sortable: true,
      cell: row => (
        <div className="text-center">
          <FontAwesomeIcon 
            icon={row.hasContact ? faCheck : faXmark} 
            className={row.hasContact ? "text-success" : "text-danger"}
          />
        </div>
      ),
    },
    {
      name: 'Products',
      selector: row => row.hasProducts,
      sortable: true,
      cell: row => (
        <div className="text-center">
          <FontAwesomeIcon 
            icon={row.hasProducts ? faCheck : faXmark} 
            className={row.hasProducts ? "text-success" : "text-danger"}
          />
        </div>
      ),
    },
    {
      name: 'Media',
      selector: row => row.hasMedia,
      sortable: true,
      cell: row => (
        <div className="text-center">
          <FontAwesomeIcon 
            icon={row.hasMedia ? faCheck : faXmark} 
            className={row.hasMedia ? "text-success" : "text-danger"}
          />
        </div>
      ),
    },
    {
      name: 'Location',
      selector: row => row.hasLocation,
      sortable: true,
      cell: row => (
        <div className="text-center">
          <FontAwesomeIcon 
            icon={row.hasLocation ? faCheck : faXmark} 
            className={row.hasLocation ? "text-success" : "text-danger"}
          />
        </div>
      ),
    },
    {
      name: 'Additional',
      selector: row => row.hasAdditional,
      sortable: true,
      cell: row => (
        <div className="text-center">
          <FontAwesomeIcon 
            icon={row.hasAdditional ? faCheck : faXmark} 
            className={row.hasAdditional ? "text-success" : "text-danger"}
          />
        </div>
      ),
    },
    {
      name: 'Actions',
      cell: row => (
        <div className="d-flex gap-2">
          <Button
            variant="info"
            size="sm"
            className="me-2"
            onClick={() => handleView(row)}
            title="Voir"
          >
            <FontAwesomeIcon icon={faEye} />
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => navigate(`/type-entreprises/${row.id}`)}
            title="Modifier"
          >
            <FontAwesomeIcon icon={faEdit} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              setSelectedType(row);
              setShowDeleteModal(true);
            }}
            title="Supprimer"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      ),
    },
  ];

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
        <Button type="primary" onClick={() => navigate('/type-entreprises/new')}>
          Create New Type
        </Button>
      </div>

      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher un type par nom ou description..."
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
              <th>Nom</th>
              <th>Description</th>
              <th>Entite</th>
              <th>Business</th>
              <th>Contact</th>
              <th>Produits</th>
              <th>Media</th>
              <th>Location</th>
              <th>Additional</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTypes.map(type => (
              <tr key={type.id}>
                <td>{type.nom}</td>
                <td>{type.description}</td>
                <td className="text-center">
                  <FontAwesomeIcon 
                    icon={type.hasEntite ? faCheck : faXmark} 
                    className={type.hasEntite ? "text-success" : "text-danger"}
                  />
                </td>
                <td className="text-center">
                  <FontAwesomeIcon 
                    icon={type.hasBusiness ? faCheck : faXmark} 
                    className={type.hasBusiness ? "text-success" : "text-danger"}
                  />
                </td>
                <td className="text-center">
                  <FontAwesomeIcon 
                    icon={type.hasContact ? faCheck : faXmark} 
                    className={type.hasContact ? "text-success" : "text-danger"}
                  />
                </td>
                <td className="text-center">
                  <FontAwesomeIcon 
                    icon={type.hasProducts ? faCheck : faXmark} 
                    className={type.hasProducts ? "text-success" : "text-danger"}
                  />
                </td>
                <td className="text-center">
                  <FontAwesomeIcon 
                    icon={type.hasMedia ? faCheck : faXmark} 
                    className={type.hasMedia ? "text-success" : "text-danger"}
                  />
                </td>
                <td className="text-center">
                  <FontAwesomeIcon 
                    icon={type.hasLocation ? faCheck : faXmark} 
                    className={type.hasLocation ? "text-success" : "text-danger"}
                  />
                </td>
                <td className="text-center">
                  <FontAwesomeIcon 
                    icon={type.hasAdditional ? faCheck : faXmark} 
                    className={type.hasAdditional ? "text-success" : "text-danger"}
                  />
                </td>
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
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/type-entreprises/${type.id}`)}
                    title="Modifier"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
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
                <strong>Nom:</strong> {selectedType.nom}
              </div>
              <div className="col-12 mb-3">
                <strong>Description:</strong> {selectedType.description}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Contact:</strong>{" "}
                <FontAwesomeIcon 
                  icon={selectedType.hasContact ? faCheck : faXmark} 
                  className={selectedType.hasContact ? "text-success" : "text-danger"}
                />
              </div>
              <div className="col-md-6 mb-3">
                <strong>Business:</strong>{" "}
                <FontAwesomeIcon 
                  icon={selectedType.hasBusiness ? faCheck : faXmark} 
                  className={selectedType.hasBusiness ? "text-success" : "text-danger"}
                />
              </div>
              <div className="col-md-6 mb-3">
                <strong>Produits:</strong>{" "}
                <FontAwesomeIcon 
                  icon={selectedType.hasProducts ? faCheck : faXmark} 
                  className={selectedType.hasProducts ? "text-success" : "text-danger"}
                />
              </div>
              <div className="col-md-6 mb-3">
                <strong>Media:</strong>{" "}
                <FontAwesomeIcon 
                  icon={selectedType.hasMedia ? faCheck : faXmark} 
                  className={selectedType.hasMedia ? "text-success" : "text-danger"}
                />
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