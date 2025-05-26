import React, { useState, useEffect } from "react";
import { Table, Container, Form, InputGroup, Alert, Modal, Row, Col, Accordion } from 'react-bootstrap';
import { fetchSecteurs } from "../../services/secteurService";
import { fetchSousSecteurs } from "../../services/sousSecteurService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSecteursList = () => {
  const [secteurs, setSecteurs] = useState([]);
  const [sousSecteurs, setSousSecteurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSecteur, setSelectedSecteur] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [secteursRes, sousSecteursRes] = await Promise.all([
        fetchSecteurs(),
        fetchSousSecteurs()
      ]);
      setSecteurs(secteursRes.data);
      setSousSecteurs(sousSecteursRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError("Impossible de charger les données");
      setLoading(false);
    }
  };

  const handleView = (secteur) => {
    // Get sous-secteurs for this secteur
    const secteurSousSecteurs = sousSecteurs.filter(ss => ss.secteur?.id === secteur.id);
    setSelectedSecteur({
      ...secteur,
      sousSecteurs: secteurSousSecteurs
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSecteur(null);
  };

  const filteredSecteurs = secteurs.filter(secteur => {
    const searchTermLower = searchTerm.toLowerCase();
    return secteur?.nom?.toLowerCase().includes(searchTermLower);
  });

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-2">Chargement des données...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Liste des Secteurs</h2>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher un secteur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nom du Secteur</th>
            <th>Nombre de Sous-Secteurs</th>
          </tr>
        </thead>
        <tbody>
          {filteredSecteurs.map((secteur) => {
            const secteurSousSecteurs = sousSecteurs.filter(ss => ss.secteur?.id === secteur.id);
            return (
              <tr 
                key={secteur.id}
                onClick={() => handleView(secteur)}
                style={{ cursor: 'pointer' }}
              >
                <td>{secteur.nom || '-'}</td>
                <td>{secteurSousSecteurs.length}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal 
        show={showModal} 
        onHide={handleCloseModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails du Secteur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSecteur && (
            <Accordion>
              {/* Informations Générales */}
              <Accordion.Item eventKey="0">
                <Accordion.Header>Informations Générales</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md={6}>
                      {selectedSecteur.id && <p><strong>ID:</strong> {selectedSecteur.id}</p>}
                      {selectedSecteur.nom && <p><strong>Nom:</strong> {selectedSecteur.nom}</p>}
                      {selectedSecteur.code && <p><strong>Code:</strong> {selectedSecteur.code}</p>}
                    </Col>
                    <Col md={6}>
                      {selectedSecteur.createdAt && <p><strong>Date de création:</strong> {new Date(selectedSecteur.createdAt).toLocaleDateString()}</p>}
                      {selectedSecteur.updatedAt && <p><strong>Dernière modification:</strong> {new Date(selectedSecteur.updatedAt).toLocaleDateString()}</p>}
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>

              {/* Sous-Secteurs */}
              {selectedSecteur.sousSecteurs && selectedSecteur.sousSecteurs.length > 0 && (
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Sous-Secteurs ({selectedSecteur.sousSecteurs.length})</Accordion.Header>
                  <Accordion.Body>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Nom</th>
                          <th>Code</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedSecteur.sousSecteurs.map((sousSecteur) => (
                          <tr key={sousSecteur.id}>
                            <td>{sousSecteur.nom || '-'}</td>
                            <td>{sousSecteur.code || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {/* Statistiques */}
              {selectedSecteur.statistiques && (
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Statistiques</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        {selectedSecteur.statistiques.nombreEntites && 
                          <p><strong>Nombre d'entités:</strong> {selectedSecteur.statistiques.nombreEntites}</p>}
                        {selectedSecteur.statistiques.nombreProduits && 
                          <p><strong>Nombre de produits:</strong> {selectedSecteur.statistiques.nombreProduits}</p>}
                      </Col>
                      <Col md={6}>
                        {selectedSecteur.statistiques.contribution && 
                          <p><strong>Contribution:</strong> {selectedSecteur.statistiques.contribution}%</p>}
                        {selectedSecteur.statistiques.tauxCroissance && 
                          <p><strong>Taux de croissance:</strong> {selectedSecteur.statistiques.tauxCroissance}%</p>}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              )}
            </Accordion>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>Fermer</button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default UserSecteursList; 