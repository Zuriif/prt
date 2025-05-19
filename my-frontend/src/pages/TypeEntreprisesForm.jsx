// src/pages/TypeEntreprisesForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchTypeEntreprise,
  createTypeEntreprise,
  updateTypeEntreprise,
} from "../services/typeEntrepriseService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function TypeEntreprisesForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = { libelle: "" };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (isEdit) {
          const { data } = await fetchTypeEntreprise(id);
          setForm(data);
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
      if (isEdit) {
        await updateTypeEntreprise(id, form);
        toast.success("Type mis à jour");
      } else {
        await createTypeEntreprise(form);
        toast.success("Type créé");
      }
      navigate("/type-entreprises");
    } catch (error) {
      console.error('Error saving type:', error);
      toast.error("Erreur lors de l'enregistrement");
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
        <h2>{isEdit ? "Modifier" : "Créer"} un type d'entreprise</h2>
        <Button
          variant="secondary"
          onClick={() => navigate("/type-entreprises")}
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
            onClick={() => navigate("/type-entreprises")}
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