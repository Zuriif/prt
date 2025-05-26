import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchProduit,
  createProduit,
  updateProduit,
} from "../services/produitService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faArrowLeft,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';

export default function ProduitForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const empty = {
    nom: "",
    description: "",
    categorie: "",
    prix: "",
    entiteId: "",
    images: "",
  };

  const [form, setForm] = useState(empty);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (isEdit) {
          const { data } = await fetchProduit(id);
          setForm({
            ...data,
            prix: data.prix?.toString() || "",
            entiteId: data.entiteId?.toString() || "",
          });
          if (data.images) {
            setImagePreview(data.images);
          }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...form,
        prix: parseFloat(form.prix || 0),
        entiteId: parseInt(form.entiteId || 0, 10),
      };

      if (selectedImage) {
        // Here you would typically upload the image to your server/storage
        // and get back the URL to store in the database
        // For now, we'll just use the base64 string
        payload.images = imagePreview;
      }

      if (isEdit) {
        await updateProduit(id, payload);
        toast.success("Produit mis à jour");
      } else {
        await createProduit(payload);
        toast.success("Produit créé");
      }
      navigate("/produits");
    } catch (error) {
      console.error('Error saving product:', error);
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
        <h2>{isEdit ? "Modifier" : "Créer"} un produit</h2>
        <Button
          variant="secondary"
          onClick={() => navigate("/produits")}
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
              <Form.Label>Catégorie</Form.Label>
              <Form.Control
                type="text"
                value={form.categorie}
                onChange={e => setForm({ ...form, categorie: e.target.value })}
                required
              />
            </Form.Group>
          </div>
          <div className="col-md-6 mb-3">
            <Form.Group>
              <Form.Label>Prix</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={form.prix}
                onChange={e => setForm({ ...form, prix: e.target.value })}
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
          <div className="col-12 mb-3">
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </Form.Group>
          </div>
          <div className="col-12 mb-3">
            <Form.Group>
              <Form.Label>Image du Produit</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-2"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Aperçu" 
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                  />
                </div>
              )}
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
            onClick={() => navigate("/produits")}
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