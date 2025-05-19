// src/pages/EntiteForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function EntiteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const empty = {
    libelle: "",
    adresse: "",
    codePostal: "",
    region: "",
    telephone: "",
    fax: "",
    email: "",
    source: "",
    effectif: "",
    formeJuridique: "",
    capitalSocial: "",
    dateCreation: "",
    activites: "",
    produits: "",
    presentation: "",
    marqueRepresentee: "",
    typeEntrepriseId: "",
  };

  const [form, setForm] = useState(empty);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const typesResponse = await fetchTypeEntreprises();
        setTypes(typesResponse.data);
        
        if (isEdit) {
          const { data } = await fetchEntite(id);
          setForm({
            ...data,
            dateCreation: data.dateCreation?.slice(0, 10) || "",
            typeEntrepriseId: data.typeEntreprise?.id || "",
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Erreur lors du chargement des données');
        toast.error("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        effectif: parseInt(form.effectif || 0, 10),
        ...(form.typeEntrepriseId
          ? { typeEntreprise: { id: Number(form.typeEntrepriseId) } }
          : {}),
      };

      if (isEdit) {
        await updateEntite(id, payload);
        toast.success("Entité mise à jour");
      } else {
        await createEntite(payload);
        toast.success("Entité créée");
      }
      navigate("/entites");
    } catch (error) {
      console.error('Error saving entity:', error);
      toast.error("Erreur d'enregistrement");
    } finally {
      setSaving(false);
    }
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

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </Alert>
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
        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Libellé</Form.Label>
              <Form.Control
                type="text"
                value={form.libelle}
                onChange={e => setForm({ ...form, libelle: e.target.value })}
                required
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Type d'Entreprise</Form.Label>
              <Form.Select
                value={form.typeEntrepriseId}
                onChange={e => setForm({ ...form, typeEntrepriseId: e.target.value })}
              >
                <option value="">Sélectionner un type</option>
                {types.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.libelle}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                value={form.adresse}
                onChange={e => setForm({ ...form, adresse: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Code Postal</Form.Label>
              <Form.Control
                type="text"
                value={form.codePostal}
                onChange={e => setForm({ ...form, codePostal: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Région</Form.Label>
              <Form.Control
                type="text"
                value={form.region}
                onChange={e => setForm({ ...form, region: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                value={form.telephone}
                onChange={e => setForm({ ...form, telephone: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Fax</Form.Label>
              <Form.Control
                type="text"
                value={form.fax}
                onChange={e => setForm({ ...form, fax: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Source</Form.Label>
              <Form.Control
                type="text"
                value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Effectif</Form.Label>
              <Form.Control
                type="number"
                value={form.effectif}
                onChange={e => setForm({ ...form, effectif: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Forme Juridique</Form.Label>
              <Form.Control
                type="text"
                value={form.formeJuridique}
                onChange={e => setForm({ ...form, formeJuridique: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Capital Social</Form.Label>
              <Form.Control
                type="text"
                value={form.capitalSocial}
                onChange={e => setForm({ ...form, capitalSocial: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Date de Création</Form.Label>
              <Form.Control
                type="date"
                value={form.dateCreation}
                onChange={e => setForm({ ...form, dateCreation: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Activités</Form.Label>
              <Form.Control
                as="textarea"
                value={form.activites}
                onChange={e => setForm({ ...form, activites: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Produits</Form.Label>
              <Form.Control
                as="textarea"
                value={form.produits}
                onChange={e => setForm({ ...form, produits: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Présentation</Form.Label>
              <Form.Control
                as="textarea"
                value={form.presentation}
                onChange={e => setForm({ ...form, presentation: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Marque Représentée</Form.Label>
              <Form.Control
                type="text"
                value={form.marqueRepresentee}
                onChange={e => setForm({ ...form, marqueRepresentee: e.target.value })}
              />
            </Form.Group>
          </div>
        </div>
        <div className="mt-3">
          <Button 
            type="submit" 
            variant="primary" 
            disabled={saving}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            {saving ? 'Enregistrement...' : (isEdit ? "Mettre à jour" : "Créer")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="ms-2"
            onClick={() => navigate("/entites")}
            disabled={saving}
          >
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Annuler
          </Button>
        </div>
      </Form>
      <ToastContainer />
    </Container>
  );
}
