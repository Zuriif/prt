

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
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
} from "@fortawesome/free-solid-svg-icons";
import { Container, Form, Button, Spinner, Card, Row, Col, Accordion } from 'react-bootstrap';

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function hasRealData(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return Object.values(obj).some(value => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  });
}

function cleanPayload(payload) {
  const cleaned = { ...payload };
  const sections = [
    'entiteBusiness',
    'entiteContact',
    'entiteProducts',
    'entiteMedia',
    'entiteLocation',
    'entiteAdditional'
  ];
  sections.forEach(section => {
    if (payload[section] && !hasRealData(payload[section])) {
      delete cleaned[section];
    }
  });
  return cleaned;
}

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
        { name: "status", label: "Statut" }
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
        { name: "secteurEn", label: "Secteur EN" },
        { name: "sousSecteur", label: "Sous Secteur" },
        { name: "sousSecteurEn", label: "Sous Secteur EN" },
        { name: "presentation", label: "Présentation" },
        { name: "presentationEn", label: "Présentation EN" },
        { name: "reference", label: "Référence" },
        { name: "position", label: "Position" },
        { name: "marqueRepresente", label: "Marque Représentée" },
        { name: "actionnaires", label: "Actionnaires" },
        { name: "chiffreAffaire", label: "Chiffre d'affaires" },
        { name: "filiales", label: "Filiales" },
        { name: "fourchettePrix", label: "Fourchette Prix" },
        { name: "certifications", label: "Certifications" },
        { name: "informationComplementaire", label: "Informations complémentaires" },
        { name: "moyenPaiement", label: "Moyen de paiement" },
        { name: "quantite", label: "Quantité" },
        { name: "chiffres", label: "Chiffres" },
        { name: "actions", label: "Actions" },
        { name: "objectifs", label: "Objectifs" },
        { name: "missions", label: "Missions" },
        { name: "marches", label: "Marchés" },
        { name: "activitesEn", label: "Activités EN" },
        { name: "typeEntreprise", label: "Type Entreprise" },
        { name: "domaine", label: "Domaine" },
        { name: "prixMoyenEuro", label: "Prix Moyen Euro" },
        { name: "prixMoyenDollar", label: "Prix Moyen Dollar" },
        { name: "prixMoyenMad", label: "Prix Moyen MAD" },
        { name: "fourchetteType", label: "Fourchette Type" },
        { name: "fourchetteEuro", label: "Fourchette Euro" },
        { name: "fourchetteDollar", label: "Fourchette Dollar" },
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
        { name: "boitePostal", label: "Boîte postale" },
        { name: "adresse", label: "Adresse" },
        { name: "ville", label: "Ville" },
        { name: "codePostal", label: "Code postal" },
        { name: "pays", label: "Pays" },
        { name: "poste", label: "Poste" },
        { name: "languesParles", label: "Langues parlées" }
      ]
    },
    products: {
      title: "Produits",
      fields: [
        { name: "produits", label: "Produits" },
        { name: "produitsEn", label: "Produits EN" },
        { name: "idProduitPrinciple", label: "ID Produit principal" },
        { name: "idCertification", label: "ID Certification" },
        { name: "certifs", label: "Certifications" },
        { name: "partenaires", label: "Partenaires" },
        { name: "marquesCommerciales", label: "Marques commerciales" },
        { name: "nombreCooperatives", label: "Nombre de coopératives" },
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
        { name: "imageFondDesk", label: "Image fond desktop" },
        { name: "imageFondMob", label: "Image fond mobile" },
        { name: "imagesAdditionnelles", label: "Images additionnelles" }
      ]
    },
    location: {
      title: "Localisation",
      fields: [
        { name: "administration", label: "Administration" },
        { name: "ports", label: "Ports" },
        { name: "cheminDeFer", label: "Chemin de fer" },
        { name: "enseignement", label: "Enseignement" },
        { name: "culture", label: "Culture" },
        { name: "etat", label: "État" },
        { name: "nombreIlesAutonomes", label: "Nombre îles autonomes" },
        { name: "gouvernorat", label: "Gouvernorat" },
        { name: "departement", label: "Département" },
        { name: "commune", label: "Commune" },
        { name: "prefecture", label: "Préfecture" },
        { name: "wilaya", label: "Wilaya" },
        { name: "villeIndependante", label: "Ville indépendante" }
      ]
    },
    additional: {
      title: "Informations Additionnelles",
      fields: [
        { name: "keywords", label: "Mots clés" },
        { name: "caExport", label: "CA Export" },
        { name: "groupe", label: "Groupe" },
        { name: "missionPositionnement", label: "Mission Positionnement" },
        { name: "offresAtouts", label: "Offres et Atouts" },
        { name: "jurisdiction", label: "Juridiction" },
        { name: "incorporationDate", label: "Date Incorporation" },
        { name: "inactivationDate", label: "Date Inactivation" }
      ]
    }
  };
  

const EntiteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    libelle: '', description: '', typeEntrepriseId: '', secteurId: '', sousSecteurId: '',
    entiteBusiness: {}, entiteContact: {}, entiteProducts: {}, entiteMedia: {}, entiteLocation: {}, entiteAdditional: {}
  });
  const [typeEntreprises, setTypeEntreprises] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [sousSecteurs, setSousSecteurs] = useState([]);
  const [selectedTypeEntreprise, setSelectedTypeEntreprise] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [typesResponse, secteursResponse, sousSecteursResponse] = await Promise.all([
            fetchTypeEntreprises(),
            fetchSecteurs(),
            fetchSousSecteurs()
          ]);
          
        setSousSecteurs(sousSecteursResponse.data);
        setTypeEntreprises(typesResponse.data);
        setSecteurs(secteursResponse.data);

        if (isEdit) {
          const entiteResponse = await fetchEntite(id);
          setFormData({
            ...formData,
            ...entiteResponse.data,
            entiteBusiness: entiteResponse.data.entiteBusiness || {},
            entiteContact: entiteResponse.data.entiteContact || {},
            entiteProducts: entiteResponse.data.entiteProducts || {},
            entiteMedia: entiteResponse.data.entiteMedia || {},
            entiteLocation: entiteResponse.data.entiteLocation || {},
            entiteAdditional: entiteResponse.data.entiteAdditional || {}
          });
          const relatedType = typesResponse.data.find(type => type.id === entiteResponse.data.typeEntrepriseId);
          setSelectedTypeEntreprise(relatedType);
        }
      } catch (err) {
        toast.error("Erreur chargement données");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleInputChange = (e, groupKey) => {
    const { name, value } = e.target;
    if (groupKey) {
      const nestedKey = `entite${capitalize(groupKey)}`;
      setFormData(prev => ({
        ...prev,
        [nestedKey]: { ...prev[nestedKey], [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTypeChange = (e) => {
    const typeId = e.target.value;
    const selected = typeEntreprises.find(t => t.id === parseInt(typeId));
    setSelectedTypeEntreprise(selected);
    setFormData(prev => ({ ...prev, typeEntrepriseId: selected?.id || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = cleanPayload({
        ...formData,
        typeEntrepriseId: parseInt(formData.typeEntrepriseId || 0),
        secteurId: parseInt(formData.secteurId || 0),
        sousSecteurId: parseInt(formData.sousSecteurId || 0)
      });
      if (isEdit) await updateEntite(id, payload);
      else await createEntite(payload);
      toast.success("Succès !");
      navigate('/entites');
    } catch {
      toast.error("Erreur !");
    } finally {
      setSaving(false);
    }
  };

  const renderFieldGroups = () => {
    if (!selectedTypeEntreprise) return null;
  
    const configMap = {
      entite: 'entiteFields',
      business: 'businessFields',
      contact: 'contactFields',
      products: 'productsFields',
      media: 'mediaFields',
      location: 'locationFields',
      additional: 'additionalFields'
    };
  
    return (
      <Accordion defaultActiveKey="0">
        {Object.entries(fieldGroups).map(([groupKey, group]) => {
          const activeFields = selectedTypeEntreprise[configMap[groupKey]] || {};
          const visibleFields = group.fields.filter(field => activeFields[field.name]);
          if (visibleFields.length === 0) return null;
  
          return (
            <Accordion.Item eventKey={groupKey} key={groupKey}>
              <Accordion.Header>{group.title}</Accordion.Header>
              <Accordion.Body>
                <Row>
                  {visibleFields.map(field => (
                    <Col md={6} key={field.name}>
                      <Form.Group className="mb-3">
                        <Form.Label htmlFor={field.name}>{field.label}</Form.Label>
                        {field.name === 'secteurId' ? (
  <Form.Select
  id="secteurId"
  name="secteurId"
  value={formData.secteurId || ''}
  onChange={(e) => handleInputChange(e)}
  size={6}  
>
  <option value="">Sélectionner un secteur</option>
  {secteurs.map(s => (
    <option key={s.id} value={s.id}>{s.nom}</option>
  ))}
</Form.Select>

) : field.name === 'sousSecteurId' ? (
    <Form.Select
    id="sousSecteurId"
    name="sousSecteurId"
    value={formData.sousSecteurId || ''}
    onChange={(e) => handleInputChange(e)}
    disabled={!formData.secteurId}
    size={6}
  >
    <option value="">Sélectionner un sous-secteur</option>
    {sousSecteurs
      .filter(ss => ss.secteur?.id === parseInt(formData.secteurId))
      .map(ss => (
        <option key={ss.id} value={ss.id}>{ss.nom}</option>
      ))}
  </Form.Select>
  
) : (
  <Form.Control
    id={field.name}
    name={field.name}
    type="text"
    value={groupKey === 'entite' ? formData[field.name] || '' : formData[`entite${capitalize(groupKey)}`]?.[field.name] || ''}
    onChange={(e) => handleInputChange(e, groupKey === 'entite' ? null : groupKey)}
  />
)}

                      </Form.Group>
                    </Col>
                  ))}
                </Row>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    );
  };
  

  if (loading) {
    return <Container className="mt-4 text-center"><Spinner animation="border" /><p>Chargement...</p></Container>;
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>{isEdit ? 'Modifier' : 'Créer'} une Entité</h3>
          <Button variant="outline-secondary" onClick={() => navigate('/entites')}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Retour
          </Button>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Type d'Entreprise</Form.Label>
              <Form.Select name="typeEntrepriseId" value={formData.typeEntrepriseId} onChange={handleTypeChange} required>
                <option value="">Sélectionner un type</option>
                {typeEntreprises.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
              </Form.Select>
            </Form.Group>

            {renderFieldGroups()}

            <div className="mt-4 d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate('/entites')}>
                <FontAwesomeIcon icon={faTimes} className="me-2" /> Annuler
              </Button>
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? <><Spinner size="sm" className="me-2" />Enregistrement...</> : <><FontAwesomeIcon icon={faSave} className="me-2" />Enregistrer</>}
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
