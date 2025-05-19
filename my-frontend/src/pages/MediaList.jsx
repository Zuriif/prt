// src/pages/MediaList.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchMedia,
  downloadMedia,
  deleteMedia,
} from "../services/mediaService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faEye,
  faEdit,
  faTrash,
  faTimes,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Container, Form, InputGroup, Alert, Modal, Button, Spinner } from 'react-bootstrap';
import { AuthContext } from "../contexts/AuthContext";

export default function MediaList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadFiles();
  }, [user, navigate]);

  async function loadFiles() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchMedia();
      setFiles(res.data);
    } catch (error) {
      console.error('Error loading media:', error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        setError('Erreur lors de la récupération des médias');
        toast.error("Erreur de chargement des médias");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async id => {
    try {
      await deleteMedia(id);
      toast.success("Média supprimé avec succès");
      loadFiles();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleView = media => {
    setSelectedMedia(media);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedia(null);
  };

  const handleDownload = async id => {
    try {
      const response = await downloadMedia(id);
      const blob = response.data;
      const filename = files.find(f => f.id === id)?.nomFichier || 'download';
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur de téléchargement");
    }
  };

  const filteredFiles = files.filter(f =>
    f.nomFichier.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement des médias...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={loadFiles}>
            Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Médias</h2>
        <Link to="/media/new" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Nouveau Média
        </Link>
      </div>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher un média par nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Button 
            variant="outline-secondary" 
            onClick={() => setSearch('')}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        )}
      </InputGroup>

      {filteredFiles.length === 0 ? (
        <Alert variant="info">
          {search 
            ? "Aucun média ne correspond à votre recherche"
            : "Aucun média trouvé"}
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nom de fichier</th>
              <th>Type</th>
              <th>Entité ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map(f => (
              <tr key={f.id}>
                <td>{f.nomFichier}</td>
                <td>
                  <span className="badge bg-primary">
                    {f.type}
                  </span>
                </td>
                <td>{f.entiteId}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(f)}
                    title="Voir"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleDownload(f.id)}
                    title="Télécharger"
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </Button>
                  <Link
                    to={`/media/${f.id}`}
                    className="btn btn-warning btn-sm me-2"
                    title="Modifier"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedMedia(f);
                      setShowDeleteModal(true);
                    }}
                    title="Supprimer"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal pour voir les détails */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails du Média</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMedia && (
            <div className="row">
              <div className="col-md-6 mb-3">
                <strong>Nom:</strong> {selectedMedia.nomFichier}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Type:</strong> {selectedMedia.type}
              </div>
              <div className="col-md-6 mb-3">
                <strong>Entité ID:</strong> {selectedMedia.entiteId}
              </div>
              <div className="col-12 mb-3">
                <strong>Description:</strong>
                <p>{selectedMedia.description || '-'}</p>
              </div>
              {selectedMedia.url && (
                <div className="col-12">
                  <strong>Image:</strong>
                  <div className="mt-2">
                    <img 
                      src={selectedMedia.url} 
                      alt={selectedMedia.nomFichier} 
                      style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} 
                      className="border rounded"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer ce média ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDelete(selectedMedia?.id)}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" />
    </Container>
  );
}