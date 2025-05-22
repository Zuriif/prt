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

    const handleView = (entite) => {
        setSelectedEntite(entite);
        setShowViewModal(true);
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setSelectedEntite(null);
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
                            {Object.entries({
                                id: "ID",
                                libelle: "Nom",
                                numMB: "Numéro MB",
                                description: "Description",
                                typeEntrepriseId: "Type d'entreprise",
                                createdAt: "Date de création",
                                type: "Type",
                                SH: "SH",
                                risk: "Risk",
                                tome: "Tome",
                                region: "Région",
                                standard: "Standard"
                            }).some(([key]) => selectedEntite[key]) && (
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Informations Générales</Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col md={6}>
                                                {selectedEntite.id && <p><strong>ID:</strong> {selectedEntite.id}</p>}
                                                {selectedEntite.libelle && <p><strong>Nom:</strong> {selectedEntite.libelle}</p>}
                                                {selectedEntite.numMB && <p><strong>Numéro MB:</strong> {selectedEntite.numMB}</p>}
                                                {selectedEntite.description && <p><strong>Description:</strong> {selectedEntite.description}</p>}
                                                {selectedEntite.typeEntrepriseId && <p><strong>Type d'entreprise:</strong> {getTypeName(selectedEntite.typeEntrepriseId)}</p>}
                                                {selectedEntite.createdAt && <p><strong>Date de création:</strong> {new Date(selectedEntite.createdAt).toLocaleDateString()}</p>}
                                            </Col>
                                            <Col md={6}>
                                                {selectedEntite.type && <p><strong>Type:</strong> {selectedEntite.type}</p>}
                                                {selectedEntite.SH && <p><strong>SH:</strong> {selectedEntite.SH}</p>}
                                                {selectedEntite.risk && <p><strong>Risk:</strong> {selectedEntite.risk}</p>}
                                                {selectedEntite.tome && <p><strong>Tome:</strong> {selectedEntite.tome}</p>}
                                                {selectedEntite.region && <p><strong>Région:</strong> {selectedEntite.region}</p>}
                                                {selectedEntite.standard && <p><strong>Standard:</strong> {selectedEntite.standard}</p>}
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}

                            {/* Informations de Contact */}
                            {Object.entries({
                                telephone: "Téléphone",
                                pays: "Pays",
                                codeFiscal: "Code Fiscal",
                                ice: "ICE",
                                patente: "Patente",
                                rc: "RC",
                                cnss: "CNSS"
                            }).some(([key]) => selectedEntite[key]) && (
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>Informations de Contact</Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col md={6}>
                                                {selectedEntite.telephone && <p><strong>Téléphone:</strong> {selectedEntite.telephone}</p>}
                                                {selectedEntite.pays && <p><strong>Pays:</strong> {selectedEntite.pays}</p>}
                                                {selectedEntite.codeFiscal && <p><strong>Code Fiscal:</strong> {selectedEntite.codeFiscal}</p>}
                                                {selectedEntite.ice && <p><strong>ICE:</strong> {selectedEntite.ice}</p>}
                                            </Col>
                                            <Col md={6}>
                                                {selectedEntite.patente && <p><strong>Patente:</strong> {selectedEntite.patente}</p>}
                                                {selectedEntite.rc && <p><strong>RC:</strong> {selectedEntite.rc}</p>}
                                                {selectedEntite.cnss && <p><strong>CNSS:</strong> {selectedEntite.cnss}</p>}
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}

                            {/* Informations SEO */}
                            {Object.entries({
                                textSeo: "Text SEO",
                                metaTitle: "Meta Title",
                                metaDescription: "Meta Description",
                                titreAriane: "Titre Ariane",
                                slug: "Slug",
                                langueSite: "Langue Site"
                            }).some(([key]) => selectedEntite[key]) && (
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>Informations SEO</Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col md={6}>
                                                {selectedEntite.textSeo && <p><strong>Text SEO:</strong> {selectedEntite.textSeo}</p>}
                                                {selectedEntite.metaTitle && <p><strong>Meta Title:</strong> {selectedEntite.metaTitle}</p>}
                                            </Col>
                                            <Col md={6}>
                                                {selectedEntite.metaDescription && <p><strong>Meta Description:</strong> {selectedEntite.metaDescription}</p>}
                                                {selectedEntite.titreAriane && <p><strong>Titre Ariane:</strong> {selectedEntite.titreAriane}</p>}
                                                {selectedEntite.slug && <p><strong>Slug:</strong> {selectedEntite.slug}</p>}
                                                {selectedEntite.langueSite && <p><strong>Langue Site:</strong> {selectedEntite.langueSite}</p>}
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}

                            {/* Informations Business */}
                            {selectedEntite.entiteBusiness && Object.values(selectedEntite.entiteBusiness).some(value => value) && (
                                <Accordion.Item eventKey="3">
                                    <Accordion.Header>Informations Business</Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col md={6}>
                                                {selectedEntite.entiteBusiness.type && <p><strong>Type:</strong> {selectedEntite.entiteBusiness.type}</p>}
                                                {selectedEntite.entiteBusiness.effectif && <p><strong>Effectif:</strong> {selectedEntite.entiteBusiness.effectif}</p>}
                                                {selectedEntite.entiteBusiness.capital && <p><strong>Capital:</strong> {selectedEntite.entiteBusiness.capital}</p>}
                                                {selectedEntite.entiteBusiness.formeJuridique && <p><strong>Forme Juridique:</strong> {selectedEntite.entiteBusiness.formeJuridique}</p>}
                                                {selectedEntite.entiteBusiness.dateCreation && <p><strong>Date de Création:</strong> {selectedEntite.entiteBusiness.dateCreation}</p>}
                                            </Col>
                                            <Col md={6}>
                                                {selectedEntite.entiteBusiness.activite && <p><strong>Activité:</strong> {selectedEntite.entiteBusiness.activite}</p>}
                                                {selectedEntite.entiteBusiness.secteur && <p><strong>Secteur:</strong> {selectedEntite.entiteBusiness.secteur}</p>}
                                                {selectedEntite.entiteBusiness.sousSecteur && <p><strong>Sous Secteur:</strong> {selectedEntite.entiteBusiness.sousSecteur}</p>}
                                                {selectedEntite.entiteBusiness.presentation && <p><strong>Présentation:</strong> {selectedEntite.entiteBusiness.presentation}</p>}
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}

                            {/* Contact Détaillé */}
                            {selectedEntite.entiteContact && Object.values(selectedEntite.entiteContact).some(value => value) && (
                                <Accordion.Item eventKey="4">
                                    <Accordion.Header>Contact Détaillé</Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col md={6}>
                                                {selectedEntite.entiteContact.email && <p><strong>Email:</strong> {selectedEntite.entiteContact.email}</p>}
                                                {selectedEntite.entiteContact.gsm && <p><strong>GSM:</strong> {selectedEntite.entiteContact.gsm}</p>}
                                                {selectedEntite.entiteContact.fax && <p><strong>Fax:</strong> {selectedEntite.entiteContact.fax}</p>}
                                                {selectedEntite.entiteContact.siteWeb && <p><strong>Site Web:</strong> {selectedEntite.entiteContact.siteWeb}</p>}
                                            </Col>
                                            <Col md={6}>
                                                {selectedEntite.entiteContact.boitePostal && <p><strong>Boîte Postale:</strong> {selectedEntite.entiteContact.boitePostal}</p>}
                                                {selectedEntite.entiteContact.adresse && <p><strong>Adresse:</strong> {selectedEntite.entiteContact.adresse}</p>}
                                                {selectedEntite.entiteContact.ville && <p><strong>Ville:</strong> {selectedEntite.entiteContact.ville}</p>}
                                                {selectedEntite.entiteContact.codePostal && <p><strong>Code Postal:</strong> {selectedEntite.entiteContact.codePostal}</p>}
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}

                            {/* Produits et Services */}
                            {selectedEntite.entiteProducts && Object.values(selectedEntite.entiteProducts).some(value => value) && (
                                <Accordion.Item eventKey="5">
                                    <Accordion.Header>Produits et Services</Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col md={6}>
                                                {selectedEntite.entiteProducts.produits && <p><strong>Produits:</strong> {selectedEntite.entiteProducts.produits}</p>}
                                                {selectedEntite.entiteProducts.certifs && <p><strong>Certifications:</strong> {selectedEntite.entiteProducts.certifs}</p>}
                                                {selectedEntite.entiteProducts.partenaires && <p><strong>Partenaires:</strong> {selectedEntite.entiteProducts.partenaires}</p>}
                                                {selectedEntite.entiteProducts.marquesCommerciales && <p><strong>Marques Commerciales:</strong> {selectedEntite.entiteProducts.marquesCommerciales}</p>}
                                            </Col>
                                            <Col md={6}>
                                                {selectedEntite.entiteProducts.capacite && <p><strong>Capacité:</strong> {selectedEntite.entiteProducts.capacite}</p>}
                                                {selectedEntite.entiteProducts.puissance && <p><strong>Puissance:</strong> {selectedEntite.entiteProducts.puissance}</p>}
                                                {selectedEntite.entiteProducts.specialite && <p><strong>Spécialité:</strong> {selectedEntite.entiteProducts.specialite}</p>}
                                                {selectedEntite.entiteProducts.activites && <p><strong>Activités:</strong> {selectedEntite.entiteProducts.activites}</p>}
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}

                            {/* Localisation */}
                            {selectedEntite.entiteLocation && Object.values(selectedEntite.entiteLocation).some(value => value) && (
                                <Accordion.Item eventKey="6">
                                    <Accordion.Header>Localisation</Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col md={6}>
                                                {selectedEntite.entiteLocation.administration && <p><strong>Administration:</strong> {selectedEntite.entiteLocation.administration}</p>}
                                                {selectedEntite.entiteLocation.ports && <p><strong>Ports:</strong> {selectedEntite.entiteLocation.ports}</p>}
                                                {selectedEntite.entiteLocation.cheminDeFer && <p><strong>Chemin de Fer:</strong> {selectedEntite.entiteLocation.cheminDeFer}</p>}
                                                {selectedEntite.entiteLocation.enseignement && <p><strong>Enseignement:</strong> {selectedEntite.entiteLocation.enseignement}</p>}
                                            </Col>
                                            <Col md={6}>
                                                {selectedEntite.entiteLocation.gouvernorat && <p><strong>Gouvernorat:</strong> {selectedEntite.entiteLocation.gouvernorat}</p>}
                                                {selectedEntite.entiteLocation.region && <p><strong>Région:</strong> {selectedEntite.entiteLocation.region}</p>}
                                                {selectedEntite.entiteLocation.villeIndependante && <p><strong>Ville:</strong> {selectedEntite.entiteLocation.villeIndependante}</p>}
                                                {selectedEntite.entiteLocation.commune && <p><strong>Commune:</strong> {selectedEntite.entiteLocation.commune}</p>}
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}

                            {/* Médias */}
                            {selectedEntite.entiteMedia && Object.values(selectedEntite.entiteMedia).some(value => value) && (
                                <Accordion.Item eventKey="7">
                                    <Accordion.Header>Médias</Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col md={6}>
                                                {selectedEntite.entiteMedia.logo && <p><strong>Logo:</strong> {selectedEntite.entiteMedia.logo}</p>}
                                                {selectedEntite.entiteMedia.image1 && <p><strong>Image 1:</strong> {selectedEntite.entiteMedia.image1}</p>}
                                                {selectedEntite.entiteMedia.image2 && <p><strong>Image 2:</strong> {selectedEntite.entiteMedia.image2}</p>}
                                                {selectedEntite.entiteMedia.image3 && <p><strong>Image 3:</strong> {selectedEntite.entiteMedia.image3}</p>}
                                            </Col>
                                            <Col md={6}>
                                                {selectedEntite.entiteMedia.video1 && <p><strong>Vidéo 1:</strong> {selectedEntite.entiteMedia.video1}</p>}
                                                {selectedEntite.entiteMedia.video2 && <p><strong>Vidéo 2:</strong> {selectedEntite.entiteMedia.video2}</p>}
                                                {selectedEntite.entiteMedia.video3 && <p><strong>Vidéo 3:</strong> {selectedEntite.entiteMedia.video3}</p>}
                                                {selectedEntite.entiteMedia.file && <p><strong>Fichier:</strong> {selectedEntite.entiteMedia.file}</p>}
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}

                            {/* Informations Additionnelles */}
                            {selectedEntite.entiteAdditional && Object.values(selectedEntite.entiteAdditional).some(value => value) && (
                                <Accordion.Item eventKey="8">
                                    <Accordion.Header>Informations Additionnelles</Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            <Col md={6}>
                                                {selectedEntite.entiteAdditional.keywords && <p><strong>Keywords:</strong> {selectedEntite.entiteAdditional.keywords}</p>}
                                                {selectedEntite.entiteAdditional.caExport && <p><strong>CA Export:</strong> {selectedEntite.entiteAdditional.caExport}</p>}
                                                {selectedEntite.entiteAdditional.maisonMere && <p><strong>Maison Mère:</strong> {selectedEntite.entiteAdditional.maisonMere}</p>}
                                                {selectedEntite.entiteAdditional.groupe && <p><strong>Groupe:</strong> {selectedEntite.entiteAdditional.groupe}</p>}
                                            </Col>
                                            <Col md={6}>
                                                {selectedEntite.entiteAdditional.population && <p><strong>Population:</strong> {selectedEntite.entiteAdditional.population}</p>}
                                                {selectedEntite.entiteAdditional.nombreCommune && <p><strong>Nombre Commune:</strong> {selectedEntite.entiteAdditional.nombreCommune}</p>}
                                                {selectedEntite.entiteAdditional.nombreDouar && <p><strong>Nombre Douar:</strong> {selectedEntite.entiteAdditional.nombreDouar}</p>}
                                                {selectedEntite.entiteAdditional.domainesCompetence && <p><strong>Domaines de Compétence:</strong> {selectedEntite.entiteAdditional.domainesCompetence}</p>}
                                            </Col>
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