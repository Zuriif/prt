// src/pages/TypeEntreprisesForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, Card, Accordion } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TypeEntreprisesForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    status: 'ACTIVE',
    type: 'DEFAULT',
    entite: {},
    business: {},
    contact: {},
    products: {},
    media: {},
    location: {},
    additional: {}
  });

  const fieldGroups = {
    entite: {
      title: "Entite",
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
      title: "Contact Information",
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
      title: "Products Information",
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
      title: "Media Information",
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
      title: "Location Information",
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
      title: "Additional Information",
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
    if (id) {
      fetchTypeEntreprise();
    }
  }, [id]);

  const fetchTypeEntreprise = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/type-entreprises/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Raw server data:', data);
        
        // Utility to get default fields for a group
        const defaultFields = (fields) => {
          const obj = {};
          fields.forEach(f => { obj[f.name] = false; });
          return obj;
        };
        // Utility to merge backend fields with defaults
        const mergeFields = (defaultObj, backendObj) => ({
          ...defaultObj,
          ...backendObj
        });
        // Process each field group with merging
        const transformedData = {
          nom: data.nom || '',
          description: data.description || '',
          status: data.status || 'ACTIVE',
          type: data.type || 'DEFAULT',
          entite: {},
          business: {},
          contact: {},
          products: {},
          media: {},
          location: {},
          additional: {}
        };
        transformedData.entite = mergeFields(defaultFields(fieldGroups.entite.fields), data.entiteFields || {});
        transformedData.business = mergeFields(defaultFields(fieldGroups.business.fields), data.businessFields || {});
        transformedData.contact = mergeFields(defaultFields(fieldGroups.contact.fields), data.contactFields || {});
        transformedData.products = mergeFields(defaultFields(fieldGroups.products.fields), data.productsFields || {});
        transformedData.media = mergeFields(defaultFields(fieldGroups.media.fields), data.mediaFields || {});
        transformedData.location = mergeFields(defaultFields(fieldGroups.location.fields), data.locationFields || {});
        transformedData.additional = mergeFields(defaultFields(fieldGroups.additional.fields), data.additionalFields || {});
        
        console.log('Final transformed form data:', transformedData);
        setFormData(transformedData);
      } else if (response.status === 401) {
        toast.error('Authentication failed. Please try again.');
      } else {
        toast.error('Error fetching type entreprise');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error fetching type entreprise');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      const url = id 
        ? `http://localhost:8080/api/type-entreprises/${id}`
        : 'http://localhost:8080/api/type-entreprises';
      
      const method = id ? 'PUT' : 'POST';
      
      // Check if any fields are selected in each group
      const hasEntite = Object.values(formData.entite || {}).some(value => value === true);
      const hasBusiness = Object.values(formData.business || {}).some(value => value === true);
      const hasContact = Object.values(formData.contact || {}).some(value => value === true);
      const hasProducts = Object.values(formData.products || {}).some(value => value === true);
      const hasMedia = Object.values(formData.media || {}).some(value => value === true);
      const hasLocation = Object.values(formData.location || {}).some(value => value === true);
      const hasAdditional = Object.values(formData.additional || {}).some(value => value === true);
      
      // Transform the data to match the expected format
      const transformedData = {
        nom: formData.nom,
        description: formData.description,
        status: formData.status || 'ACTIVE',
        type: formData.type || 'DEFAULT',
        hasEntite,
        hasBusiness,
        hasContact,
        hasProducts,
        hasMedia,
        hasLocation,
        hasAdditional,
        entiteFields: formData.entite || {},
        businessFields: formData.business || {},
        contactFields: formData.contact || {},
        productsFields: formData.products || {},
        mediaFields: formData.media || {},
        locationFields: formData.location || {},
        additionalFields: formData.additional || {}
      };

      console.log('Sending data to server:', JSON.stringify(transformedData, null, 2));
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Server response:', responseData);
        toast.success(`Type entreprise ${id ? 'updated' : 'created'} successfully`);
        navigate('/type-entreprises');
      } else if (response.status === 401) {
        toast.error('Authentication failed. Please try again.');
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        toast.error(errorData.message || 'Error saving type entreprise');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error saving type entreprise');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  const handleGroupChange = (groupKey, fieldName, value) => {
    console.log('Changing field:', groupKey, fieldName, value);
    setFormData(prev => {
      // Ensure the group object exists
      const groupData = prev[groupKey] || {};
      const newData = {
        ...prev,
        [groupKey]: {
          ...groupData,
          [fieldName]: value
        }
      };
      console.log(`New form data after ${groupKey} field change:`, JSON.stringify(newData[groupKey], null, 2));
      return newData;
    });
  };

  const handleSelectAll = (groupKey, checked) => {
    console.log('Select all:', groupKey, checked);
    const fields = fieldGroups[groupKey].fields;
    const fieldValues = {};
    fields.forEach(field => {
      fieldValues[field.name] = checked;
    });
    setFormData(prev => {
      const newData = {
        ...prev,
        [groupKey]: fieldValues
      };
      console.log(`New form data after ${groupKey} select all:`, JSON.stringify(newData[groupKey], null, 2));
      return newData;
    });
  };

  const renderFieldGroups = () => {
    return Object.entries(fieldGroups).map(([groupKey, group]) => {
      // Check if all fields in the group are selected
      const allSelected = group.fields.every(field => 
        formData[groupKey] && formData[groupKey][field.name] === true
      );
      
      console.log(`Rendering ${groupKey} group:`, {
        allSelected,
        fields: formData[groupKey],
        groupFields: group.fields
      });

      return (
        <Accordion.Item key={groupKey} eventKey={groupKey}>
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center w-100">
              <span>{group.title}</span>
              <Form.Check
                type="checkbox"
                label="Select All"
                checked={allSelected}
                onChange={(e) => handleSelectAll(groupKey, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </Accordion.Header>
          <Accordion.Body>
            <div className="row">
              {group.fields.map((field) => {
                const isChecked = formData[groupKey]?.[field.name] === true;
                console.log(`Rendering ${groupKey} field ${field.name}:`, isChecked);
                return (
                  <div key={field.name} className="col-md-6 mb-3">
                    <Form.Check
                      type="checkbox"
                      id={`${groupKey}-${field.name}`}
                      label={field.label}
                      checked={isChecked}
                      onChange={(e) => handleGroupChange(groupKey, field.name, e.target.checked)}
                    />
                  </div>
                );
              })}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      );
    });
  };

  if (loading && id) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading type entreprise...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{id ? "Modifier" : "Créer"} un type d'entreprise</h2>
        <Button variant="secondary" onClick={() => navigate("/type-entreprises")}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom || ''}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
              />
            </Form.Group>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Header>Available Fields</Card.Header>
          <Card.Body>
            <Accordion>
              {renderFieldGroups()}
            </Accordion>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate('/type-entreprises')}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            <FontAwesomeIcon icon={faSave} className="me-2" />
            {loading ? "Enregistrement..." : (id ? "Mettre à jour" : "Créer")}
          </Button>
        </div>
      </Form>

      <ToastContainer />
    </Container>
  );
}