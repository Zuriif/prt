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

// Helper function to capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper function to group fields by section
const groupFieldsBySection = (formData, fieldGroups) => {
  const grouped = {
    // root fields from Entite entity
    libelle: formData.libelle,
    numMB: formData.numMB,
    description: formData.description,
    createdAt: formData.createdAt, // Assuming createdAt is handled elsewhere or not needed in payload
    type: formData.type,
    SH: formData.SH,
    risk: formData.risk,
    tome: formData.tome,
    textSeo: formData.textSeo,
    region: formData.region,
    standard: formData.standard,
    logo: formData.logo,
    pays: formData.pays,
    telephone: formData.telephone,
    codeFiscal: formData.codeFiscal,
    ice: formData.ice,
    patente: formData.patente,
    rc: formData.rc,
    cnss: formData.cnss,
    slug: formData.slug,
    metaTitle: formData.metaTitle,
    metaDescription: formData.metaDescription,
    titreAriane: formData.titreAriane,
    langueSite: formData.langueSite,
    // IDs will be parsed later
    typeEntrepriseId: formData.typeEntrepriseId,
    secteurId: formData.secteurId,
    sousSecteurId: formData.sousSecteurId,
    // status, other root fields if any
    status: formData.status,
  };

  // Add nested groups based on fieldGroups definition
  for (const [section, group] of Object.entries(fieldGroups)) {
    // 'entite' section fields are mostly handled as root fields, skip or refine as needed
    if (['entite'].includes(section)) continue;

    const nestedObjectName = `entite${capitalize(section)}`;
    grouped[nestedObjectName] = {};

    group.fields.forEach(f => {
      // Include the field in the nested object if it exists in formData
      if (formData[f.name] !== undefined) {
        grouped[nestedObjectName][f.name] = formData[f.name];
      }
    });

    // If the nested object is empty after grouping, remove it from the payload
    if (Object.keys(grouped[nestedObjectName]).length === 0) {
      delete grouped[nestedObjectName];
    }
  }
  return grouped;
};

// Utility function to regroup fields into their respective sections
const regroupFields = (formData, fieldLists) => {
    const result = {};
    Object.entries(fieldLists).forEach(([section, fields]) => {
        result[section] = {};
        fields.forEach(field => {
            if (formData[field] !== undefined) {
                result[section][field] = formData[field];
            }
        });
    });
    return result;
};

// Define all fields for each section
const fieldLists = {
    entiteBusiness: [
        "type", "SH", "risk", "tome", "typePrixMoyen", "effectif", "capital", "formeJuridique",
        "dateCreation", "activite", "secteur", "secteurEn", "sousSecteur", "sousSecteurEn", "presentation",
        "presentationEn", "reference", "position", "marqueRepresente", "actionnaires", "chiffreAffaire", "filiales",
        "fourchettePrix", "certifications", "informationComplementaire", "moyenPaiement", "quantite", "chiffres", "actions",
        "objectifs", "missions", "marches", "activitesEn", "typeEntreprise", "domaine", "prixMoyenEuro", "prixMoyenDollar",
        "prixMoyenMad", "fourchetteType", "fourchetteEuro", "fourchetteDollar", "regime", "domainesPrioritaires"
    ],
    entiteContact: [
        "telephone", "email", "gsm", "fax", "siteWeb", "boitePostal", "adresse", "ville", "codePostal",
        "pays", "poste", "languesParles"
    ],
    entiteProducts: [
        "produits", "produitsEn", "idProduitPrinciple", "idCertification", "certifs", "partenaires",
        "marquesCommerciales", "nombreCooperatives", "capacite", "puissance", "destinction", "source",
        "composition", "dimention", "specialite", "activites", "rubriques", "autre", "autres"
    ],
    entiteMedia: [
        "video1", "video2", "video3", "image1", "image2", "image3", "imageFondDesk", "imageFondMob",
        "imagesAdditionnelles", "produitListingDesk", "produitListingMob", "imageProduitDesk", "imageProduitMob",
        "partenaireImageDesk", "partenaireImageMob", "certifImageDesk", "certifImageMob", "producteurFondDesk",
        "producteurFondMob", "logo", "file", "new1", "new2", "new3"
    ],
    entiteLocation: [
        "administration", "ports", "cheminDeFer", "enseignement", "culture", "etat", "nombreIlesAutonomes",
        "gouvernorat", "districtProvince", "comte", "departement", "commune", "prefecture", "sousPrefecture",
        "wilaya", "villeIndependante", "municipalite", "chabiyat", "cercle", "village", "zoneDuGouvernementLocal",
        "circonscription", "delegation", "chefferie", "coCapital", "region"
    ],
    entiteAdditional: [
        "textSeo", "metaTitle", "metaDescription", "titreAriane", "slug", "langueSite", "keywords",
        "keywordsEn", "caExport", "maisonMere", "groupe", "population", "nombreCommune", "nombreDouar",
        "domainesCompetence", "missionPositionnement", "recentesInterventions", "presentationExpertise",
        "offresAtouts", "titreMiseAvant", "sex", "language", "nationality", "physicalDescription",
        "charges", "jurisdiction", "incorporationDate", "inactivationDate", "status", "poids",
        "document", "alias", "secondName", "usine", "tomes", "date", "l3", "l8", "l11", "l12",
        "l13", "l14", "l15", "l16", "l17", "l18", "l19", "u5", "u8", "u9"
    ]
};

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
      createdAt: '', // Assuming createdAt is handled elsewhere or not needed in payload
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
      // IDs will be parsed later
      status: '',
      // Initialize nested entities
      entiteBusiness: {},
      entiteContact: {},
      entiteProducts: {},
      entiteMedia: {},
      entiteLocation: {},
      entiteAdditional: {}
    };

    const [formData, setFormData] = useState(emptyEntite);
    const [typeEntreprises, setTypeEntreprises] = useState([]);
    const [secteurs, setSecteurs] = useState([]);
    const [sousSecteurs, setSousSecteurs] = useState([]);
    const [selectedTypeEntreprise, setSelectedTypeEntreprise] = useState(null);
    const [selectedSecteur, setSelectedSecteur] = useState(null);

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
                { name: "logo", label: "Logo" },
                { name: "pays", label: "Pays" },
                { name: "telephone", label: "Téléphone" },
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
                { name: "typeEntrepriseId", label: "Type Entreprise ID" },
                { name: "secteurId", label: "Secteur ID" },
                { name: "sousSecteurId", label: "Sous Secteur ID" },
                { name: "createdAt", label: "Created At" },
                { name: "updatedAt", label: "Updated At" },
                { name: "deletedAt", label: "Deleted At" },
                { name: "createdBy", label: "Created By" },
                { name: "updatedBy", label: "Updated By" },
                { name: "deletedBy", label: "Deleted By" },
                { name: "status", label: "Status" }
            ]
        },
        business: {
            title: "Informations Business",
            fields: [
                { name: "type", label: "Type" },
                { name: "SH", label: "SH" },
                { name: "risk", label: "Risk" },
                { name: "tome", label: "Tome" },
                { name: "typePrixMoyen", label: "Type Prix Moyen" },
                { name: "effectif", label: "Effectif" },
                { name: "capital", label: "Capital" },
                { name: "formeJuridique", label: "Forme Juridique" },
                { name: "dateCreation", label: "Date de Création" },
                { name: "activite", label: "Activité" },
                { name: "secteur", label: "Secteur" },
                { name: "secteurEn", label: "Secteur (EN)" },
                { name: "sousSecteur", label: "Sous Secteur" },
                { name: "sousSecteurEn", label: "Sous Secteur (EN)" },
                { name: "presentation", label: "Présentation" },
                { name: "presentationEn", label: "Présentation (EN)" },
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
                { name: "activitesEn", label: "Activités (EN)" },
                { name: "typeEntreprise", label: "Type d'Entreprise" },
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
                { name: "telephone", label: "Téléphone" },
                { name: "email", label: "Email" },
                { name: "gsm", label: "GSM" },
                { name: "fax", label: "Fax" },
                { name: "siteWeb", label: "Site Web" },
                { name: "boitePostal", label: "Boîte Postale" },
                { name: "adresse", label: "Adresse" },
                { name: "ville", label: "Ville" },
                { name: "codePostal", label: "Code Postal" },
                { name: "pays", label: "Pays" },
                { name: "poste", label: "Poste" },
                { name: "languesParles", label: "Langues Parlées" }
            ]
        },
        products: {
            title: "Informations Produits",
            fields: [
                { name: "produits", label: "Produits" },
                { name: "produitsEn", label: "Produits (EN)" },
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
                { name: "coCapital", label: "Co-Capital" },
                { name: "region", label: "Région" }
            ]
        },
        additional: {
            title: "Informations Additionnelles",
            fields: [
                { name: "textSeo", label: "Text SEO" },
                { name: "metaTitle", label: "Meta Title" },
                { name: "metaDescription", label: "Meta Description" },
                { name: "titreAriane", label: "Titre Ariane" },
                { name: "slug", label: "Slug" },
                { name: "langueSite", label: "Langue Site" },
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
                { name: "date", label: "Date" },
                { name: "l3", label: "L3" },
                { name: "l8", label: "L8" },
                { name: "l11", label: "L11" },
                { name: "l12", label: "L12" },
                { name: "l13", label: "L13" },
                { name: "l14", label: "L14" },
                { name: "l15", label: "L15" },
                { name: "l16", label: "L16" },
                { name: "l17", label: "L17" },
                { name: "l18", label: "L18" },
                { name: "l19", label: "L19" },
                { name: "u5", label: "U5" },
                { name: "u8", label: "U8" },
                { name: "u9", label: "U9" }
            ]
        }
    };

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
                    
                    // Merge fetched data with emptyEntite to ensure all nested objects are initialized
                    setFormData(prev => ({
                        ...emptyEntite, // Start with empty structure
                        ...entiteResponse.data, // Overlay fetched data
                        // Explicitly ensure nested objects are not null/undefined
                        entiteBusiness: entiteResponse.data.entiteBusiness || {},
                        entiteContact: entiteResponse.data.entiteContact || {},
                        entiteProducts: entiteResponse.data.entiteProducts || {},
                        entiteMedia: entiteResponse.data.entiteMedia || {},
                        entiteLocation: entiteResponse.data.entiteLocation || {},
                        entiteAdditional: entiteResponse.data.entiteAdditional || {}
                    }));

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

    const handleInputChange = (event, groupKey = null) => {
        const { name, value } = event.target;
        
        if (groupKey && groupKey !== 'entite') {
            const nestedKey = `entite${capitalize(groupKey)}`;
            setFormData(prev => ({
                ...prev,
                [nestedKey]: {
                    ...prev[nestedKey],
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (event, fieldName, groupKey = null) => {
        const file = event.target.files[0];
        if (!file) return;

        if (groupKey && groupKey !== 'entite') {
            const nestedKey = `entite${capitalize(groupKey)}`;
            setFormData(prev => ({
                ...prev,
                [nestedKey]: {
                    ...prev[nestedKey],
                    [fieldName]: file.name
                }
            }));
        } else {
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
            // First, regroup all fields into their respective sections
            const groupedFields = regroupFields(formData, fieldLists);

            // Create the final payload with the correct structure
            const payload = {
                // Keep the main entity fields
                libelle: formData.libelle,
                numMB: formData.numMB,
                description: formData.description,
                type: formData.type,
                SH: formData.SH,
                risk: formData.risk,
                tome: formData.tome,
                textSeo: formData.textSeo,
                region: formData.region,
                standard: formData.standard,
                logo: formData.logo,
                pays: formData.pays,
                telephone: formData.telephone,
                codeFiscal: formData.codeFiscal,
                ice: formData.ice,
                patente: formData.patente,
                rc: formData.rc,
                cnss: formData.cnss,
                slug: formData.slug,
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                titreAriane: formData.titreAriane,
                langueSite: formData.langueSite,
                status: formData.status,

                // Parse IDs to integers
                typeEntrepriseId: parseInt(formData.typeEntrepriseId || 0, 10),
                secteurId: parseInt(formData.secteurId || 0, 10),
                sousSecteurId: parseInt(formData.sousSecteurId || 0, 10),

                // Add the grouped fields
                entiteBusiness: groupedFields.entiteBusiness,
                entiteContact: groupedFields.entiteContact,
                entiteProducts: groupedFields.entiteProducts,
                entiteMedia: groupedFields.entiteMedia,
                entiteLocation: groupedFields.entiteLocation,
                entiteAdditional: groupedFields.entiteAdditional
            };

            console.log('Sending data to server:', JSON.stringify(payload, null, 2));

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

    const renderFieldGroups = () => {
        if (!selectedTypeEntreprise) return null;

        // Mapping section to config keys
        const typeConfigFields = {
            entite: 'entiteFields',
            business: 'businessFields',
            contact: 'contactFields',
            products: 'productsFields',
            media: 'mediaFields',
            location: 'locationFields',
            additional: 'additionalFields',
        };

        // Add debug log
        console.log('Selected type entreprise config:', selectedTypeEntreprise);

        return Object.entries(fieldGroups).map(([key, group]) => {
            // Get the enabled fields config for this group (if any)
            const enabledFieldsConfig = selectedTypeEntreprise[typeConfigFields[key]] || {};

            // Filter the fields to show only those enabled for this typeEntreprise
            const visibleFields = group.fields.filter(
                field => enabledFieldsConfig[field.name]
            );

            // Show nothing if no fields enabled for this group
            if (visibleFields.length === 0) return null;

            return (
                <Accordion.Item eventKey={key} key={key}>
                    <Accordion.Header>{group.title}</Accordion.Header>
                    <Accordion.Body>
                        <Row>
                            {visibleFields.map(field => (
                                <Col md={6} key={field.name}>
                                    {renderField(field, key)}
                                </Col>
                            ))}
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            );
        });
    };

    const renderField = (field, groupKey) => {
        // Special handling for specific fields
        if (field.name === 'secteur' || field.name === 'sousSecteur') {
            // These are handled separately as they are direct IDs on Entite, not nested fields
            // Keep their original logic, accessing directly from formData
            if (field.name === 'secteur') {
                 return (
                    <Form.Group className="mb-3" key={field.name}>
                        <Form.Label htmlFor={field.name}>{field.label}</Form.Label>
                        <Form.Select
                            id={field.name}
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
                        <Form.Label htmlFor={field.name}>{field.label}</Form.Label>
                        <Form.Select
                            id={field.name}
                            name="sousSecteurId"
                            value={formData.sousSecteurId}
                            onChange={(e) => handleInputChange(e, 'entite')}
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
        }

        // Handle media fields (file inputs - autocomplete not typically applicable)
        if (groupKey === 'media' && (field.name.startsWith('image') || field.name.startsWith('video') || field.name === 'logo' || field.name === 'file' || field.name.startsWith('produitListing') || field.name.startsWith('imageProduit') || field.name.startsWith('partenaireImage') || field.name.startsWith('certifImage') || field.name.startsWith('producteurFond') || field.name.startsWith('new'))) {
            const fileInputId = `file-${field.name}`;
             const nestedKey = `entite${capitalize(groupKey)}`;
             const fieldValue = formData[nestedKey]?.[field.name] || '';
            return (
                <Form.Group className="mb-3" key={field.name}>
                    <Form.Label htmlFor={fileInputId}>{field.label}</Form.Label>
                    <Form.Control
                        id={fileInputId}
                        type="file"
                        accept={field.name.startsWith('image') || field.name === 'logo' || field.name.includes('Image') ? 'image/*' : (field.name.startsWith('video') ? 'video/*' : '*/*')}
                        onChange={(e) => handleFileChange(e, field.name, groupKey)}
                    />
                    {fieldValue && (
                        <small className="text-muted">Current File: {fieldValue}</small>
                    )}
                </Form.Group>
            );
        }

        // Default text input for other fields
        const inputId = field.name;
        const fieldValue = groupKey === 'entite' ? formData[field.name] || '' : formData[`entite${capitalize(groupKey)}`]?.[field.name] || '';

        return (
            <Form.Group className="mb-3" key={field.name}>
                <Form.Label htmlFor={inputId}>{field.label}</Form.Label>
                <Form.Control
                    id={inputId}
                    type="text"
                    name={field.name}
                    value={fieldValue}
                    onChange={(e) => handleInputChange(e, groupKey)}
                    autoComplete="off"
                />
            </Form.Group>
        );
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
                                autoComplete="organization-title"
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