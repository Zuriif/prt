import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchEntite,
  createEntite,
  updateEntite,
} from "../services/entiteService";
import { fetchTypeEntreprises } from "../services/typeEntrepriseService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faArrowLeft,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Container, Form, Button, Alert, Spinner, Card, Row, Col, Accordion } from 'react-bootstrap';

const EntiteForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const emptyEntite = {
      libelle: '',
      numMB: '',
      description: '',
      createdAt: '',
      type: '',
      SH: '',
      risk: null,
      tome: null,
      textSeo: '',
      region: '',
      standard: '',
      logo: '',
      pays: '',
      telephone: '',
      codeFiscal: '',
      ice: '',
      patente: '',
      rc: '',
      cnss: '',
      slug: '',
      metaTitle: '',
      metaDescription: '',
      titreAriane: '',
      langueSite: '',
      typeEntrepriseId: '',
      entiteFields: {},
      businessFields: {},
      contactFields: {},
      productsFields: {},
      mediaFields: {},
      locationFields: {},
      additionalFields: {}
    };

    const [formData, setFormData] = useState(emptyEntite);
    const [typeEntreprises, setTypeEntreprises] = useState([]);
    const [selectedTypeEntreprise, setSelectedTypeEntreprise] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const typesResponse = await fetchTypeEntreprises();
                setTypeEntreprises(typesResponse.data);

                if (isEdit) {
                    const entiteResponse = await fetchEntite(id);
                    setFormData(entiteResponse.data);
                    const relatedType = typesResponse.data.find(type => type.id === entiteResponse.data.typeEntrepriseId);
                    setSelectedTypeEntreprise(relatedType);
                } else {
                    setFormData(emptyEntite);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error("Erreur lors du chargement des données");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, isEdit]);

    const handleTypeChange = (event) => {
        const typeId = event.target.value;
        console.log('Selected type ID from event:', typeId);
        const selectedType = typeEntreprises.find(type => {
            console.log('Comparing type:', type.id, typeId);
            return type.id === parseInt(typeId, 10);
        });
        console.log('Found selected type:', selectedType);
        setSelectedTypeEntreprise(selectedType || null);
        setFormData(prev => {
            const newData = { 
                ...prev, 
                typeEntrepriseId: selectedType ? selectedType.id : null 
            };
            console.log('Updated form data with type:', newData);
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        console.log('Form data before submission:', formData);

        try {
            const payload = {
              ...formData,
              typeEntrepriseId: parseInt(formData.typeEntrepriseId || 0, 10),
            };
            console.log('Final payload being sent to backend:', payload);

            if (isEdit) {
                await updateEntite(id, payload);
                toast.success('Entite updated successfully');
            } else {
                const response = await createEntite(payload);
                console.log('Create entite response:', response);
                toast.success('Entite created successfully');
            }
            navigate('/entites');
        } catch (error) {
            console.error('Error saving entite:', error);
            toast.error('Erreur lors de l\'enregistrement de l\'entité');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const renderFieldGroups = () => {
        if (!selectedTypeEntreprise) return null;

        const fieldGroups = {
            entite: {
                title: "Entite",
                fields: [
                  { name: "libelle", label: "Nom" },
                  { name: "numMB", label: "Numéro MB" },
                  { name: "description", label: "Description" },
                  { name: "createdAt", label: "Created At" },
                  { name: "type", label: "Type" },
                  { name: "SH", label: "SH" },
                  { name: "risk", label: "Risk" },
                  { name: "tome", label: "Tome" },
                  { name: "textSeo", label: "Text SEO" },
                  { name: "region", label: "Region" },
                  { name: "standard", label: "Standard" },
                  { name: "logo", label: "Logo" },
                  { name: "pays", label: "Pays" },
                  { name: "telephone", label: "Telephone" },
                  { name: "codeFiscal", label: "Code Fiscal" },
                  { name: "ice", label: "ICE" },
                  { name: "patente", label: "Patente" },
                  { name: "rc", label: "RC" },
                  { name: "cnss", label: "CNSS" },
                  { name: "slug", label: "Slug" },
                  { name: "metaTitle", label: "Meta Title" },
                  { name: "metaDescription", label: "Meta Description" },
                  { name: "titreAriane", label: "Titre Ariane" },
                  { name: "langueSite", label: "Langue Site" },
                ]
              },
            business: {
                title: "Business Information",
                fields: [
                    { name: "type", label: "Type" },
                    { name: "SH", label: "SH" },
                    { name: "risk", label: "Risk" },
                    { name: "tome", label: "Tome" },
                    { name: "typePrixMoyen", label: "Type Prix Moyen" },
                    { name: "effectif", label: "Effectif" },
                    { name: "capital", label: "Capital" },
                    { name: "formeJuridique", label: "Forme Juridique" },
                    { name: "dateCreation", label: "Date Creation" },
                    { name: "activite", label: "Activite" },
                    { name: "secteur", label: "Secteur" },
                    { name: "sousSecteur", label: "Sous Secteur" },
                    { name: "presentation", label: "Presentation" },
                    { name: "reference", label: "Reference" },
                    { name: "position", label: "Position" },
                    { name: "marqueRepresente", label: "Marque Represente" },
                    { name: "actionnaires", label: "Actionnaires" },
                    { name: "chiffreAffaire", label: "Chiffre Affaire" },
                    { name: "filiales", label: "Filiales" },
                    { name: "fourchettePrix", label: "Fourchette Prix" },
                    { name: "certifications", label: "Certifications" }
                ]
            },
            contact: {
                title: "Contact Information",
                fields: [
                    { name: "telephone", label: "Telephone" },
                    { name: "email", label: "Email" },
                    { name: "gsm", label: "GSM" },
                    { name: "fax", label: "Fax" },
                    { name: "siteWeb", label: "Site Web" },
                    { name: "boitePostal", label: "Boite Postal" },
                    { name: "adresse", label: "Adresse" },
                    { name: "ville", label: "Ville" },
                    { name: "codePostal", label: "Code Postal" },
                    { name: "pays", label: "Pays" },
                    { name: "poste", label: "Poste" },
                    { name: "languesParles", label: "Langues Parles" }
                ]
            },
            products: {
                title: "Products Information",
                fields: [
                    { name: "produits", label: "Produits" },
                    { name: "certifs", label: "Certifications" },
                    { name: "partenaires", label: "Partenaires" },
                    { name: "marquesCommerciales", label: "Marques Commerciales" },
                    { name: "nombreCooperatives", label: "Nombre Cooperatives" },
                    { name: "capacite", label: "Capacite" },
                    { name: "puissance", label: "Puissance" },
                    { name: "destinction", label: "Destinction" },
                    { name: "source", label: "Source" },
                    { name: "composition", label: "Composition" },
                    { name: "dimention", label: "Dimension" },
                    { name: "specialite", label: "Specialite" },
                    { name: "activites", label: "Activites" },
                    { name: "rubriques", label: "Rubriques" }
                ]
            },
            media: {
                title: "Media Information",
                fields: [
                    { name: "video1", label: "Video 1" },
                    { name: "video2", label: "Video 2" },
                    { name: "video3", label: "Video 3" },
                    { name: "image1", label: "Image 1" },
                    { name: "image2", label: "Image 2" },
                    { name: "image3", label: "Image 3" },
                    { name: "imageFondDesk", label: "Image Fond Desktop" },
                    { name: "imageFondMob", label: "Image Fond Mobile" },
                    { name: "imagesAdditionnelles", label: "Images Additionnelles" },
                    { name: "logo", label: "Logo" },
                    { name: "file", label: "File" }
                ]
            },
            location: {
                title: "Location Information",
                fields: [
                    { name: "administration", label: "Administration" },
                    { name: "ports", label: "Ports" },
                    { name: "cheminDeFer", label: "Chemin De Fer" },
                    { name: "enseignement", label: "Enseignement" },
                    { name: "culture", label: "Culture" },
                    { name: "etat", label: "Etat" },
                    { name: "gouvernorat", label: "Gouvernorat" },
                    { name: "districtProvince", label: "District Province" },
                    { name: "comte", label: "Comte" },
                    { name: "departement", label: "Departement" },
                    { name: "commune", label: "Commune" },
                    { name: "prefecture", label: "Prefecture" },
                    { name: "sousPrefecture", label: "Sous Prefecture" },
                    { name: "wilaya", label: "Wilaya" },
                    { name: "region", label: "Region" }
                ]
            },
            additional: {
                title: "Additional Information",
                fields: [
                    { name: "textSeo", label: "Text SEO" },
                    { name: "metaTitle", label: "Meta Title" },
                    { name: "metaDescription", label: "Meta Description" },
                    { name: "titreAriane", label: "Titre Ariane" },
                    { name: "slug", label: "Slug" },
                    { name: "langueSite", label: "Langue Site" },
                    { name: "keywords", label: "Keywords" },
                    { name: "caExport", label: "CA Export" },
                    { name: "maisonMere", label: "Maison Mere" },
                    { name: "groupe", label: "Groupe" },
                    { name: "population", label: "Population" },
                    { name: "nombreCommune", label: "Nombre Commune" },
                    { name: "nombreDouar", label: "Nombre Douar" },
                    { name: "domainesCompetence", label: "Domaines Competence" },
                    { name: "missionPositionnement", label: "Mission Positionnement" }
                ]
            }
        };

        const accordionItems = Object.entries(fieldGroups).map(([groupKey, group]) => {
             const selectedGroupFields = selectedTypeEntreprise[`${groupKey}Fields`] || {};

            const fieldsToShow = group.fields.filter(field => selectedGroupFields[field.name]);

            if (fieldsToShow.length === 0) return null;

            return (
                <Accordion.Item eventKey={groupKey} key={groupKey}>
                    <Accordion.Header>{group.title}</Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            {fieldsToShow.map(field => (
                                <Col md={6} className="mb-3" key={field.name}>
                                    <Form.Group controlId={`${groupKey}-${field.name}`}>
                                        <Form.Label>{field.label}</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            ))}
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            );
        }).filter(item => item !== null);

        return <Accordion>{accordionItems}</Accordion>;
    };

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
                <h2>{isEdit ? "Modifier" : "Créer"} une entité</h2>
                <Button 
                    variant="secondary"
                    onClick={() => navigate("/entites")}
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    Retour
                </Button>
            </div>

            <Form onSubmit={handleSubmit}>
                <Card className="mb-4">
                     <Card.Body>
                        <Form.Group controlId="typeEntrepriseSelect">
                            <Form.Label>Type d'entreprise</Form.Label>
                            <Form.Control
                                as="select"
                                value={formData.typeEntrepriseId || ''}
                                onChange={handleTypeChange}
                                required
                            >
                                <option value="">Select a type</option>
                                {typeEntreprises.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.nom}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                     </Card.Body>
                </Card>

                {selectedTypeEntreprise && (
                    <Card title="Fields" className="mb-4">
                         <Card.Header>Fields</Card.Header>
                         <Card.Body>
                            {renderFieldGroups()}
                         </Card.Body>
                    </Card>
                )}

                <div className="d-flex justify-content-end gap-2">
                    <Button 
                        variant="secondary"
                        onClick={() => navigate('/entites')}
                    >
                        <FontAwesomeIcon icon={faTimes} className="me-2" />
                        Annuler
                    </Button>
                    <Button 
                        variant="primary"
                        type="submit" 
                        disabled={saving}
                    >
                        <FontAwesomeIcon icon={faSave} className="me-2" />
                        {saving ? "Enregistrement..." : (isEdit ? "Mettre à jour" : "Créer")}
                    </Button>
                </div>
            </Form>

             <ToastContainer />
        </Container>
    );
};

export default EntiteForm;