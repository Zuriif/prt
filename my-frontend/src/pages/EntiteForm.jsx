import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchEntite,
  createEntite,
  updateEntite,
} from "../services/entiteService";
import { fetchTypeEntreprises } from "../services/typeEntrepriseService";
import { fetchSecteurs } from "../services/secteurService";
import { fetchSousSecteurs } from "../services/sousSecteurService";
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
      secteurId: '',
      sousSecteurId: '',
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
    const [secteurs, setSecteurs] = useState([]);
    const [sousSecteurs, setSousSecteurs] = useState([]);
    const [selectedTypeEntreprise, setSelectedTypeEntreprise] = useState(null);
    const [selectedSecteur, setSelectedSecteur] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [typesResponse, secteursResponse] = await Promise.all([
                    fetchTypeEntreprises(),
                    fetchSecteurs()
                ]);
                setTypeEntreprises(typesResponse.data);
                setSecteurs(secteursResponse.data);

                if (isEdit) {
                    const entiteResponse = await fetchEntite(id);
                    setFormData(entiteResponse.data);
                    const relatedType = typesResponse.data.find(type => type.id === entiteResponse.data.typeEntrepriseId);
                    setSelectedTypeEntreprise(relatedType);
                    if (entiteResponse.data.secteurId) {
                        const secteurSousSecteurs = await fetchSousSecteurs();
                        setSousSecteurs(secteurSousSecteurs.data.filter(ss => ss.secteur?.id === entiteResponse.data.secteurId));
                    }
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

    const handleTypeChange = async (event) => {
        const typeId = event.target.value;
        const selectedType = typeEntreprises.find(type => type.id === parseInt(typeId, 10));
        setSelectedTypeEntreprise(selectedType || null);
        setFormData(prev => ({
            ...prev,
            typeEntrepriseId: selectedType ? selectedType.id : null
        }));
    };

    const handleSecteurChange = async (event) => {
        const secteurId = event.target.value;
        setSelectedSecteur(secteurId);
        setFormData(prev => ({
            ...prev,
            secteurId: secteurId,
            sousSecteurId: '' // Reset sous-secteur when secteur changes
        }));

        if (secteurId) {
            try {
                const sousSecteursResponse = await fetchSousSecteurs();
                setSousSecteurs(sousSecteursResponse.data.filter(ss => ss.secteur?.id === parseInt(secteurId, 10)));
            } catch (error) {
                console.error('Error loading sous-secteurs:', error);
                toast.error("Erreur lors du chargement des sous-secteurs");
            }
        } else {
            setSousSecteurs([]);
        }
    };

    const handleFileChange = (event, fieldName) => {
        const file = event.target.files[0];
        if (file) {
            // Here you would typically upload the file to your server
            // and get back a URL or file ID
            // For now, we'll just store the file name
            setFormData(prev => ({
                ...prev,
                [fieldName]: file.name
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...formData,
                typeEntrepriseId: parseInt(formData.typeEntrepriseId || 0, 10),
                secteurId: parseInt(formData.secteurId || 0, 10),
                sousSecteurId: parseInt(formData.sousSecteurId || 0, 10)
            };

            if (isEdit) {
                await updateEntite(id, payload);
                toast.success('Entite updated successfully');
            } else {
                await createEntite(payload);
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

    const renderField = (field) => {
        // Special handling for specific fields
        if (field.name === 'secteur') {
            return (
                <Form.Group className="mb-3" key={field.name}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Select
                        name="secteurId"
                        value={formData.secteurId}
                        onChange={handleSecteurChange}
                    >
                        <option value="">Sélectionner un secteur</option>
                        {secteurs.map(secteur => (
                            <option key={secteur.id} value={secteur.id}>
                                {secteur.nom}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            );
        }

        if (field.name === 'sousSecteur') {
            return (
                <Form.Group className="mb-3" key={field.name}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Select
                        name="sousSecteurId"
                        value={formData.sousSecteurId}
                        onChange={handleInputChange}
                        disabled={!formData.secteurId}
                    >
                        <option value="">Sélectionner un sous-secteur</option>
                        {sousSecteurs.map(sousSecteur => (
                            <option key={sousSecteur.id} value={sousSecteur.id}>
                                {sousSecteur.nom}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
            );
        }

        // Handle media fields
        if (field.name.startsWith('image') || field.name.startsWith('video') || field.name === 'logo') {
            return (
                <Form.Group className="mb-3" key={field.name}>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                        type="file"
                        accept={field.name.startsWith('image') || field.name === 'logo' ? 'image/*' : 'video/*'}
                        onChange={(e) => handleFileChange(e, field.name)}
                    />
                    {formData[field.name] && (
                        <small className="text-muted">File selected: {formData[field.name]}</small>
                    )}
                </Form.Group>
            );
        }

        // Default text input for other fields
        return (
            <Form.Group className="mb-3" key={field.name}>
                <Form.Label>{field.label}</Form.Label>
                <Form.Control
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                />
            </Form.Group>
        );
    };

    const renderFieldGroups = () => {
        if (!selectedTypeEntreprise) return null;

        const fieldGroups = {
            entite: {
                title: "Informations Générales",
                fields: [
                    { name: "libelle", label: "Nom" },
                    { name: "numMB", label: "Numéro MB" },
                    { name: "description", label: "Description" },
                    { name: "type", label: "Type" },
                    { name: "SH", label: "SH" },
                    { name: "risk", label: "Risk" },
                    { name: "tome", label: "Tome" },
                    { name: "textSeo", label: "Text SEO" },
                    { name: "region", label: "Région" },
                    { name: "standard", label: "Standard" },
                    { name: "pays", label: "Pays" },
                    { name: "telephone", label: "Téléphone" },
                    { name: "codeFiscal", label: "Code Fiscal" },
                    { name: "ice", label: "ICE" },
                    { name: "patente", label: "Patente" },
                    { name: "rc", label: "RC" },
                    { name: "cnss", label: "CNSS" }
                ]
            },
            business: {
                title: "Informations Business",
                fields: [
                    { name: "typePrixMoyen", label: "Type Prix Moyen" },
                    { name: "effectif", label: "Effectif" },
                    { name: "capital", label: "Capital" },
                    { name: "formeJuridique", label: "Forme Juridique" },
                    { name: "dateCreation", label: "Date de Création" },
                    { name: "activite", label: "Activité" },
                    { name: "secteur", label: "Secteur" },
                    { name: "sousSecteur", label: "Sous Secteur" },
                    { name: "presentation", label: "Présentation" },
                    { name: "reference", label: "Référence" },
                    { name: "position", label: "Position" },
                    { name: "marqueRepresente", label: "Marque Représentée" },
                    { name: "actionnaires", label: "Actionnaires" },
                    { name: "chiffreAffaire", label: "Chiffre d'Affaires" },
                    { name: "filiales", label: "Filiales" },
                    { name: "fourchettePrix", label: "Fourchette de Prix" },
                    { name: "certifications", label: "Certifications" },
                    { name: "informationComplementaire", label: "Information Complémentaire" },
                    { name: "moyenPaiement", label: "Moyen de Paiement" },
                    { name: "quantite", label: "Quantité" },
                    { name: "chiffres", label: "Chiffres" },
                    { name: "actions", label: "Actions" },
                    { name: "objectifs", label: "Objectifs" },
                    { name: "missions", label: "Missions" },
                    { name: "marches", label: "Marchés" },
                    { name: "domaine", label: "Domaine" },
                    { name: "prixMoyenEuro", label: "Prix Moyen (EUR)" },
                    { name: "prixMoyenDollar", label: "Prix Moyen (USD)" },
                    { name: "prixMoyenMad", label: "Prix Moyen (MAD)" },
                    { name: "fourchetteType", label: "Type de Fourchette" },
                    { name: "fourchetteEuro", label: "Fourchette (EUR)" },
                    { name: "fourchetteDollar", label: "Fourchette (USD)" },
                    { name: "regime", label: "Régime" },
                    { name: "domainesPrioritaires", label: "Domaines Prioritaires" }
                ]
            },
            contact: {
                title: "Informations Contact",
                fields: [
                    { name: "email", label: "Email" },
                    { name: "gsm", label: "GSM" },
                    { name: "fax", label: "Fax" },
                    { name: "siteWeb", label: "Site Web" },
                    { name: "boitePostal", label: "Boîte Postale" },
                    { name: "adresse", label: "Adresse" },
                    { name: "ville", label: "Ville" },
                    { name: "codePostal", label: "Code Postal" },
                    { name: "poste", label: "Poste" },
                    { name: "languesParles", label: "Langues Parlées" }
                ]
            },
            products: {
                title: "Informations Produits",
                fields: [
                    { name: "produits", label: "Produits" },
                    { name: "idProduitPrinciple", label: "ID Produit Principal" },
                    { name: "idCertification", label: "ID Certification" },
                    { name: "certifs", label: "Certifications" },
                    { name: "partenaires", label: "Partenaires" },
                    { name: "marquesCommerciales", label: "Marques Commerciales" },
                    { name: "nombreCooperatives", label: "Nombre de Coopératives" },
                    { name: "capacite", label: "Capacité" },
                    { name: "puissance", label: "Puissance" },
                    { name: "destinction", label: "Distinction" },
                    { name: "source", label: "Source" },
                    { name: "composition", label: "Composition" },
                    { name: "dimention", label: "Dimension" },
                    { name: "specialite", label: "Spécialité" },
                    { name: "activites", label: "Activités" },
                    { name: "rubriques", label: "Rubriques" },
                    { name: "autre", label: "Autre" },
                    { name: "autres", label: "Autres" }
                ]
            },
            media: {
                title: "Médias",
                fields: [
                    { name: "video1", label: "Vidéo 1" },
                    { name: "video2", label: "Vidéo 2" },
                    { name: "video3", label: "Vidéo 3" },
                    { name: "image1", label: "Image 1" },
                    { name: "image2", label: "Image 2" },
                    { name: "image3", label: "Image 3" },
                    { name: "imageFondDesk", label: "Image Fond Desktop" },
                    { name: "imageFondMob", label: "Image Fond Mobile" },
                    { name: "imagesAdditionnelles", label: "Images Additionnelles" },
                    { name: "produitListingDesk", label: "Listing Produit Desktop" },
                    { name: "produitListingMob", label: "Listing Produit Mobile" },
                    { name: "imageProduitDesk", label: "Image Produit Desktop" },
                    { name: "imageProduitMob", label: "Image Produit Mobile" },
                    { name: "partenaireImageDesk", label: "Image Partenaire Desktop" },
                    { name: "partenaireImageMob", label: "Image Partenaire Mobile" },
                    { name: "certifImageDesk", label: "Image Certification Desktop" },
                    { name: "certifImageMob", label: "Image Certification Mobile" },
                    { name: "producteurFondDesk", label: "Fond Producteur Desktop" },
                    { name: "producteurFondMob", label: "Fond Producteur Mobile" },
                    { name: "logo", label: "Logo" },
                    { name: "file", label: "Fichier" },
                    { name: "new1", label: "Nouveau 1" },
                    { name: "new2", label: "Nouveau 2" },
                    { name: "new3", label: "Nouveau 3" }
                ]
            },
            location: {
                title: "Informations Localisation",
                fields: [
                    { name: "administration", label: "Administration" },
                    { name: "ports", label: "Ports" },
                    { name: "cheminDeFer", label: "Chemin de Fer" },
                    { name: "enseignement", label: "Enseignement" },
                    { name: "culture", label: "Culture" },
                    { name: "etat", label: "État" },
                    { name: "nombreIlesAutonomes", label: "Nombre d'Îles Autonomes" },
                    { name: "gouvernorat", label: "Gouvernorat" },
                    { name: "districtProvince", label: "District/Province" },
                    { name: "comte", label: "Comté" },
                    { name: "departement", label: "Département" },
                    { name: "commune", label: "Commune" },
                    { name: "prefecture", label: "Préfecture" },
                    { name: "sousPrefecture", label: "Sous-Préfecture" },
                    { name: "wilaya", label: "Wilaya" },
                    { name: "villeIndependante", label: "Ville Indépendante" },
                    { name: "municipalite", label: "Municipalité" },
                    { name: "chabiyat", label: "Chabiyat" },
                    { name: "cercle", label: "Cercle" },
                    { name: "village", label: "Village" },
                    { name: "zoneDuGouvernementLocal", label: "Zone du Gouvernement Local" },
                    { name: "circonscription", label: "Circonscription" },
                    { name: "delegation", label: "Délégation" },
                    { name: "chefferie", label: "Chefferie" },
                    { name: "coCapital", label: "Co-Capital" }
                ]
            },
            additional: {
                title: "Informations Additionnelles",
                fields: [
                    { name: "keywords", label: "Mots-clés" },
                    { name: "keywordsEn", label: "Mots-clés (EN)" },
                    { name: "caExport", label: "CA Export" },
                    { name: "maisonMere", label: "Maison Mère" },
                    { name: "groupe", label: "Groupe" },
                    { name: "population", label: "Population" },
                    { name: "nombreCommune", label: "Nombre de Communes" },
                    { name: "nombreDouar", label: "Nombre de Douars" },
                    { name: "domainesCompetence", label: "Domaines de Compétence" },
                    { name: "missionPositionnement", label: "Mission et Positionnement" },
                    { name: "recentesInterventions", label: "Interventions Récentes" },
                    { name: "presentationExpertise", label: "Présentation Expertise" },
                    { name: "offresAtouts", label: "Offres et Atouts" },
                    { name: "titreMiseAvant", label: "Titre Mis en Avant" },
                    { name: "sex", label: "Sexe" },
                    { name: "language", label: "Langue" },
                    { name: "nationality", label: "Nationalité" },
                    { name: "physicalDescription", label: "Description Physique" },
                    { name: "charges", label: "Charges" },
                    { name: "jurisdiction", label: "Juridiction" },
                    { name: "incorporationDate", label: "Date d'Incorporation" },
                    { name: "inactivationDate", label: "Date d'Inactivation" },
                    { name: "status", label: "Statut" },
                    { name: "poids", label: "Poids" },
                    { name: "document", label: "Document" },
                    { name: "alias", label: "Alias" },
                    { name: "secondName", label: "Second Nom" },
                    { name: "usine", label: "Usine" },
                    { name: "tomes", label: "Tomes" },
                    { name: "date", label: "Date" }
                ]
            }
        };

        return Object.entries(fieldGroups).map(([key, group]) => (
            <Accordion.Item eventKey={key} key={key}>
                <Accordion.Header>{group.title}</Accordion.Header>
                <Accordion.Body>
                    <Row>
                        {group.fields.map(field => (
                            <Col md={6} key={field.name}>
                                {renderField(field)}
                            </Col>
                        ))}
                    </Row>
                </Accordion.Body>
            </Accordion.Item>
        ));
    };

    if (loading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-2">Chargement des données...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h3>{isEdit ? 'Modifier' : 'Créer'} une Entité</h3>
                    <Button variant="outline-secondary" onClick={() => navigate('/entites')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                        Retour
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Type d'Entreprise</Form.Label>
                            <Form.Select
                                name="typeEntrepriseId"
                                value={formData.typeEntrepriseId || ''}
                                onChange={handleTypeChange}
                                required
                            >
                                <option value="">Sélectionner un type d'entreprise</option>
                                {typeEntreprises.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.nom}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {selectedTypeEntreprise && (
                            <Accordion defaultActiveKey="0">
                                {renderFieldGroups()}
                            </Accordion>
                        )}

                        <div className="mt-4 d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => navigate('/entites')}>
                                <FontAwesomeIcon icon={faTimes} className="me-2" />
                                Annuler
                            </Button>
                            <Button variant="primary" type="submit" disabled={saving}>
                                {saving ? (
                                    <>
                                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSave} className="me-2" />
                                        Enregistrer
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
            <ToastContainer />
        </Container>
    );
};

export default EntiteForm;