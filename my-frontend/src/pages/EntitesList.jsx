import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchEntites, deleteEntite } from "../services/entiteService";
import { fetchTypeEntreprises } from "../services/typeEntrepriseService";
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
import { Table, Container, Form, InputGroup, Alert, Modal, Button, Spinner, Accordion, Row, Col } from 'react-bootstrap';

const EntiteList = () => {
    const [entites, setEntites] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEntite, setSelectedEntite] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEntiteType, setSelectedEntiteType] = useState(null);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [entitesResponse, typesResponse] = await Promise.all([
                fetchEntites(),
                fetchTypeEntreprises()
            ]);

            console.log('Fetched entites:', entitesResponse.data);
            console.log('Fetched types:', typesResponse.data);

            setEntites(entitesResponse.data);
            setTypes(typesResponse.data);

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteEntite(id);
            toast.success('Entite deleted successfully');
            fetchData();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting entite:', error);
            toast.error('Erreur lors de la suppression de l\'entité');
        }
    };

    const handleView = async (entite) => {
        setSelectedEntite(entite);
        try {
            if (entite.typeEntrepriseId) {
                const typeResponse = types.find(type => Number(type.id) === Number(entite.typeEntrepriseId));
                setSelectedEntiteType(typeResponse || null);
            } else {
                setSelectedEntiteType(null);
            }
        } catch (error) {
            console.error('Error fetching entity type for view:', error);
            setSelectedEntiteType(null);
        }
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedEntite(null);
        setSelectedEntiteType(null);
    };

    const confirmDelete = (entite) => {
        setSelectedEntite(entite);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedEntite(null);
    };

    const getTypeName = (typeId) => {
        console.log('Getting type name for ID:', typeId);
        console.log('Current types:', types);
        if (!typeId) {
            console.log('No type ID provided');
            return 'Unknown';
        }
        const type = types.find(t => {
            console.log('Comparing:', t.id, typeId, 'Types:', typeof t.id, typeof typeId);
            return Number(t.id) === Number(typeId);
        });
        console.log('Found type:', type);
        return type ? type.nom : 'Unknown';
    };

    const filteredEntites = entites.filter(entite => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
            entite.libelle?.toLowerCase().includes(searchTermLower) ||
            entite.description?.toLowerCase().includes(searchTermLower)
        );
    });

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </Spinner>
                <p className="mt-2">Chargement des données...</p>
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
                    placeholder="Rechercher une entité par nom ou description..."
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
                <Alert variant="info">{searchTerm ? "Aucune entité ne correspond à votre recherche" : "Aucune entité trouvée"}</Alert>
            ) : (
                 <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Type d'entreprise</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEntites.map(entite => (
                            <tr key={entite.id}>
                                <td>{entite.libelle}</td>
                                <td>{getTypeName(entite.typeEntrepriseId)}</td>
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
                                        className="btn btn-primary btn-sm me-2"
                                        title="Modifier"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Link>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => confirmDelete(entite)}
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

             <Modal show={showViewModal} onHide={handleCloseViewModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de l'Entité</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEntite && (
                        <Accordion>
                        {/* Informations Générales */}
                        {selectedEntite && (
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>Informations Générales</Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                {Object.entries(selectedEntite)
                                  .filter(([key, value]) =>
                                    !['entiteBusiness','entiteContact','entiteProducts','entiteMedia','entiteLocation','entiteAdditional'].includes(key)
                                    && value && typeof value !== 'object'
                                  )
                                  .map(([key, value]) => (
                                    <Col md={6} key={key}>
                                      <p><strong>{key}:</strong> {String(value)}</p>
                                    </Col>
                                  ))}
                              </Row>
                            </Accordion.Body>
                          </Accordion.Item>
                        )}
                      
                        {/* Informations Business */}
                        {selectedEntite.entiteBusiness && Object.values(selectedEntite.entiteBusiness).some(v => v) && (
                          <Accordion.Item eventKey="1">
                            <Accordion.Header>Informations Business</Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                {Object.entries(selectedEntite.entiteBusiness)
                                  .filter(([key, value]) => value && typeof value !== 'object')
                                  .map(([key, value]) => (
                                    <Col md={6} key={key}>
                                      <p><strong>{key}:</strong> {String(value)}</p>
                                    </Col>
                                  ))}
                              </Row>
                            </Accordion.Body>
                          </Accordion.Item>
                        )}
                      
                        {/* Informations Contact */}
                        {selectedEntite.entiteContact && Object.values(selectedEntite.entiteContact).some(v => v) && (
                          <Accordion.Item eventKey="2">
                            <Accordion.Header>Informations Contact</Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                {Object.entries(selectedEntite.entiteContact)
                                  .filter(([key, value]) => value && typeof value !== 'object')
                                  .map(([key, value]) => (
                                    <Col md={6} key={key}>
                                      <p><strong>{key}:</strong> {String(value)}</p>
                                    </Col>
                                  ))}
                              </Row>
                            </Accordion.Body>
                          </Accordion.Item>
                        )}
                      
                        {/* Informations Produits */}
                        {selectedEntite.entiteProducts && Object.values(selectedEntite.entiteProducts).some(v => v) && (
                          <Accordion.Item eventKey="3">
                            <Accordion.Header>Produits et Services</Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                {Object.entries(selectedEntite.entiteProducts)
                                  .filter(([key, value]) => value && typeof value !== 'object')
                                  .map(([key, value]) => (
                                    <Col md={6} key={key}>
                                      <p><strong>{key}:</strong> {String(value)}</p>
                                    </Col>
                                  ))}
                              </Row>
                            </Accordion.Body>
                          </Accordion.Item>
                        )}
                      
                        {/* Localisation */}
                        {selectedEntite.entiteLocation && Object.values(selectedEntite.entiteLocation).some(v => v) && (
                          <Accordion.Item eventKey="4">
                            <Accordion.Header>Localisation</Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                {Object.entries(selectedEntite.entiteLocation)
                                  .filter(([key, value]) => value && typeof value !== 'object')
                                  .map(([key, value]) => (
                                    <Col md={6} key={key}>
                                      <p><strong>{key}:</strong> {String(value)}</p>
                                    </Col>
                                  ))}
                              </Row>
                            </Accordion.Body>
                          </Accordion.Item>
                        )}
                      
                        {/* Médias */}
                        {selectedEntite.entiteMedia && Object.values(selectedEntite.entiteMedia).some(v => v) && (
                          <Accordion.Item eventKey="5">
                            <Accordion.Header>Médias</Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                {Object.entries(selectedEntite.entiteMedia)
                                  .filter(([key, value]) => value && typeof value !== 'object')
                                  .map(([key, value]) => (
                                    <Col md={6} key={key}>
                                      <p><strong>{key}:</strong> {String(value)}</p>
                                    </Col>
                                  ))}
                              </Row>
                            </Accordion.Body>
                          </Accordion.Item>
                        )}
                      
                        {/* Informations Additionnelles */}
                        {selectedEntite.entiteAdditional && Object.values(selectedEntite.entiteAdditional).some(v => v) && (
                          <Accordion.Item eventKey="6">
                            <Accordion.Header>Informations Additionnelles</Accordion.Header>
                            <Accordion.Body>
                              <Row>
                                {Object.entries(selectedEntite.entiteAdditional)
                                  .filter(([key, value]) => value && typeof value !== 'object')
                                  .map(([key, value]) => (
                                    <Col md={6} key={key}>
                                      <p><strong>{key}:</strong> {String(value)}</p>
                                    </Col>
                                  ))}
                              </Row>
                            </Accordion.Body>
                          </Accordion.Item>
                        )}
                      
                      </Accordion>
                      
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseViewModal}>Fermer</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer l'entité "{selectedEntite?.libelle}" ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>Annuler</Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedEntite?.id)}>Supprimer</Button>
                </Modal.Footer>
            </Modal>

             <ToastContainer />
        </Container>
    );
};

export default EntiteList; 