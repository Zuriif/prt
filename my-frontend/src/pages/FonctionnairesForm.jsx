import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchFonctionnaire,
  createFonctionnaire,
  updateFonctionnaire,
} from "../services/fonctionnaireService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function FonctionnaireForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const empty = {
    nom: "",
    prenom: "",
    email: "",
    gsm: "",
    profil: "",
    entiteId: "",
  };

  const [form, setForm] = useState(empty);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isEdit) {
          const { data } = await fetchFonctionnaire(id);
          setForm({
            ...data,
            entiteId: data.entiteId?.toString() || "",
          });
        } else {
          setForm(empty);
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
        entiteId: parseInt(form.entiteId || 0, 10),
      };

      if (isEdit) {
        await updateFonctionnaire(id, payload);
        toast.success("Fonctionnaire mis à jour");
      } else {
        await createFonctionnaire(payload);
        toast.success("Fonctionnaire créé");
      }
      navigate("/fonctionnaires");
    } catch (error) {
      console.error('Error saving fonctionnaire:', error);
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
        <h2>{isEdit ? "Modifier" : "Créer"} un fonctionnaire</h2>
        <Button
          variant="secondary"
          onClick={() => navigate("/fonctionnaires")}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
                required
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                value={form.prenom}
                onChange={e => setForm({ ...form, prenom: e.target.value })}
                required
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
                required
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>GSM</Form.Label>
              <Form.Control
                type="text"
                value={form.gsm}
                onChange={e => setForm({ ...form, gsm: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Profil</Form.Label>
              <Form.Control
                type="text"
                value={form.profil}
                onChange={e => setForm({ ...form, profil: e.target.value })}
                required
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>ID de l'Entité</Form.Label>
              <Form.Control
                type="number"
                value={form.entiteId}
                onChange={e => setForm({ ...form, entiteId: e.target.value })}
                required
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
            onClick={() => navigate("/fonctionnaires")}
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