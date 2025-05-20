import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSousSecteur, createSousSecteur, updateSousSecteur } from "../services/sousSecteurService";
import { fetchSecteurs } from "../services/secteurService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function SousSecteurForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [secteurs, setSecteurs] = useState([]);
  const [formData, setFormData] = useState({
    nom: "",
    secteurId: ""
  });

  useEffect(() => {
    loadSecteurs();
    if (id) {
      loadSousSecteur();
    }
  }, [id]);

  const loadSecteurs = async () => {
    try {
      const { data } = await fetchSecteurs();
      setSecteurs(data);
    } catch (error) {
      console.error('Error fetching secteurs:', error);
      toast.error("Erreur lors du chargement des secteurs");
    }
  };

  const loadSousSecteur = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await fetchSousSecteur(id);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching sous-secteur:', error);
      setError('Erreur lors de la récupération du sous-secteur');
      toast.error("Erreur lors du chargement du sous-secteur");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const payload = {
        nom: formData.nom,
        secteur: formData.secteurId ? { id: formData.secteurId } : null
      };
      if (id) {
        await updateSousSecteur(id, payload);
        toast.success("Sous-secteur mis à jour avec succès");
      } else {
        await createSousSecteur(payload);
        toast.success("Sous-secteur créé avec succès");
      }
      navigate("/sous-secteurs");
    } catch (error) {
      console.error('Error saving sous-secteur:', error);
      setError('Erreur lors de la sauvegarde du sous-secteur');
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
        <p className="mt-2">Chargement du sous-secteur...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{id ? "Modifier le Sous-Secteur" : "Nouveau Sous-Secteur"}</h2>
        <Button variant="secondary" onClick={() => navigate("/sous-secteurs")}>
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
          <Form.Label>Nom du sous-secteur</Form.Label>
          <Form.Control
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            placeholder="Entrez le nom du sous-secteur"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Secteur parent</Form.Label>
          <Form.Select
            name="secteurId"
            value={formData.secteurId}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionnez un secteur</option>
            {secteurs.map(secteur => (
              <option key={secteur.id} value={secteur.id}>
                {secteur.nom}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate("/sous-secteurs")}>
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