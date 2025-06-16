import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchEntites, deleteEntite } from "../services/entiteService";
import { fetchTypeEntreprises } from "../services/typeEntrepriseService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye, faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Table, Container, Form, InputGroup, Alert, Modal, Button, Spinner, Accordion, Row, Col } from 'react-bootstrap';

// Fonction de filtrage ultra robuste
function hasRealData(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return Object.entries(obj).some(
    ([key, value]) => key !== 'id' && value !== null && value !== undefined && String(value).trim() !== ''
  );
}

const EntiteList = () => {
    const [entites, setEntites] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEntite, setSelectedEntite] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [entitesResponse, typesResponse] = await Promise.all([
                fetchEntites(),
                fetchTypeEntreprises()
            ]);

            setEntites(entitesResponse.data || []);
            setTypes(typesResponse.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        try {
            await deleteEntite(id);
            toast.success('Entité supprimée');
            fetchData();
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting entite:', error);
            toast.error("Erreur lors de la suppression");
        }
    };

    const handleView = (entite) => {
        setSelectedEntite(entite);
        setShowViewModal(true);
    };

    const getTypeName = (typeId) => {
        const type = types.find(t => Number(t.id) === Number(typeId));
        return type ? type.nom : 'Unknown';
    };

    const filteredEntites = entites.filter(entite => {
        const search = searchTerm.toLowerCase();
        return (
            entite.libelle?.toLowerCase().includes(search) ||
            entite.description?.toLowerCase().includes(search)
        );
    });

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status" />
                <p className="mt-2">Chargement des données...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between mb-4">
                <h2>Gestion des Entités</h2>
                <Link to="/entites/new" className="btn btn-primary">
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Nouvelle Entité
                </Link>
            </div>

            <InputGroup className="mb-4">
                <Form.Control
                    placeholder="Rechercher par nom ou description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                )}
            </InputGroup>

            {filteredEntites.length === 0 ? (
                <Alert variant="info">
                    {searchTerm ? "Aucun résultat" : "Aucune entité trouvée"}
                </Alert>
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
                                    <Button variant="info" size="sm" onClick={() => handleView(entite)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </Button>{' '}
                                    <Link to={`/entites/${entite.id}`} className="btn btn-primary btn-sm">
                                        <FontAwesomeIcon icon={faEdit} />
                                    </Link>{' '}
                                    <Button variant="danger" size="sm" onClick={() => { setSelectedEntite(entite); setShowDeleteModal(true); }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de l'Entité</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEntite && (
                        <Accordion>
                            {renderSection("Informations Générales", selectedEntite, [
                                'libelle', 'numMB', 'description', 'type', 'SH', 'risk', 'tome',
                                'textSeo', 'region', 'standard', 'logo', 'pays', 'telephone',
                                'codeFiscal', 'ice', 'patente', 'rc', 'cnss', 'slug', 'metaTitle',
                                'metaDescription', 'titreAriane', 'langueSite'
                            ])}

                            {hasRealData(selectedEntite.entiteBusiness) && renderSection("Informations Business", selectedEntite.entiteBusiness)}
                            {hasRealData(selectedEntite.entiteContact) && renderSection("Informations Contact", selectedEntite.entiteContact)}
                            {hasRealData(selectedEntite.entiteProducts) && renderSection("Produits", selectedEntite.entiteProducts)}
                            {hasRealData(selectedEntite.entiteLocation) && renderSection("Localisation", selectedEntite.entiteLocation)}
                            {hasRealData(selectedEntite.entiteMedia) && renderSection("Médias", selectedEntite.entiteMedia)}
                            {hasRealData(selectedEntite.entiteAdditional) && renderSection("Informations Additionnelles", selectedEntite.entiteAdditional)}
                        </Accordion>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowViewModal(false)}>Fermer</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Supprimer l'entité</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Êtes-vous sûr de vouloir supprimer "{selectedEntite?.libelle}" ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Annuler</Button>
                    <Button variant="danger" onClick={() => handleDelete(selectedEntite?.id)}>Supprimer</Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </Container>
    );

    function renderSection(title, data, fields = null) {
        if (!data || typeof data !== 'object') return null;

        const entries = fields 
            ? fields.map(field => [field, data[field]])
            : Object.entries(data);

        const filteredEntries = entries.filter(([_, value]) => value !== null && value !== undefined && String(value).trim() !== '');

        if (filteredEntries.length === 0) return null;

        return (
            <Accordion.Item eventKey={title}>
                <Accordion.Header>{title}</Accordion.Header>
                <Accordion.Body>
                    <Row>
                        {filteredEntries.map(([key, value]) => (
                            <Col md={6} key={key}>
                                <p><strong>{key}:</strong> {String(value)}</p>
                            </Col>
                        ))}
                    </Row>
                </Accordion.Body>
            </Accordion.Item>
        );
    }
};

export default EntiteList;
