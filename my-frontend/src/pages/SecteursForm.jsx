import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSecteur, createSecteur, updateSecteur } from "../services/secteurService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function SecteurForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: ""
  });

  useEffect(() => {
    if (id) {
      loadSecteur();
    }
  }, [id]);

  const loadSecteur = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchSecteur(id);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching secteur:', error);
      setError('Erreur lors de la récupération du secteur');
      toast.error("Erreur lors du chargement du secteur");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (id) {
        await updateSecteur(id, formData);
        toast.success("Secteur mis à jour avec succès");
      } else {
        await createSecteur(formData);
        toast.success("Secteur créé avec succès");
      }
      navigate("/secteurs");
    } catch (error) {
      console.error('Error saving secteur:', error);
      setError('Erreur lors de la sauvegarde du secteur');
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && id) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement du secteur...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{id ? "Modifier le Secteur" : "Nouveau Secteur"}</h2>
        <Button variant="secondary" onClick={() => navigate("/secteurs")}>
          <FontAwesomeIcon icon={faTimes} className="me-2" />
          Annuler
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nom du secteur</Form.Label>
          <Form.Control
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            placeholder="Entrez le nom du secteur"
          />
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate("/secteurs")}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            <FontAwesomeIcon icon={faSave} className="me-2" />
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </Form>

      <ToastContainer />
    </Container>
  );
} 