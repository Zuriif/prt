import React, { useState, useEffect } from 'react';
import { Table, Container, Form, InputGroup, Alert, Modal, Row, Col } from 'react-bootstrap';
import client from '../../api/axiosClient';

const UserEntitesList = () => {
  const [entites, setEntites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntite, setSelectedEntite] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEntites();
  }, []);

  const fetchEntites = async () => {
    try {
      console.log('Fetching entities...');
      const response = await client.get('/api/entites');
      console.log('Entities response:', response.data);
      setEntites(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.response?.data?.message || 'Erreur lors de la récupération des entités');
      setLoading(false);
    }
  };

  const handleRowClick = (entite) => {
    setSelectedEntite(entite);
    setShowModal(true);
  };

  const filteredEntites = entites.filter(entite => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      entite?.libelle?.toLowerCase().includes(searchTermLower) ||
      entite?.typeEntreprise?.libelle?.toLowerCase().includes(searchTermLower) ||
      entite?.adresse?.toLowerCase().includes(searchTermLower) ||
      entite?.region?.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return <div>Chargement...</div>;
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
      <h2 className="mb-4">Liste des Entités</h2>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher une entité..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nom de l'Entité</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntites.map((entite) => (
            <tr 
              key={entite.id}
              onClick={() => handleRowClick(entite)}
              style={{ cursor: 'pointer' }}
            >
              <td>{entite.libelle || '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'Entité</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEntite && (
            <Container fluid>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Informations Générales</h5>
                  <p><strong>Nom:</strong> {selectedEntite.libelle || '-'}</p>
                  <p><strong>Type:</strong> {selectedEntite.typeEntreprise?.libelle || '-'}</p>
                  <p><strong>Date de création:</strong> {selectedEntite.dateCreation ? new Date(selectedEntite.dateCreation).toLocaleDateString() : '-'}</p>
                  <p><strong>Forme juridique:</strong> {selectedEntite.formeJuridique || '-'}</p>
                  <p><strong>Capital social:</strong> {selectedEntite.capitalSocial || '-'}</p>
                  <p><strong>Effectif:</strong> {selectedEntite.effectif || '-'}</p>
                </Col>
                <Col md={6}>
                  <h5>Contact</h5>
                  <p><strong>Adresse:</strong> {selectedEntite.adresse || '-'}</p>
                  <p><strong>Code postal:</strong> {selectedEntite.codePostal || '-'}</p>
                  <p><strong>Région:</strong> {selectedEntite.region || '-'}</p>
                  <p><strong>Téléphone:</strong> {selectedEntite.telephone || '-'}</p>
                  <p><strong>Fax:</strong> {selectedEntite.fax || '-'}</p>
                  <p><strong>Email:</strong> {selectedEntite.email || '-'}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h5>Activités et Produits</h5>
                  <p><strong>Activités:</strong> {selectedEntite.activites || '-'}</p>
                  <p><strong>Produits:</strong> {selectedEntite.produits || '-'}</p>
                  <p><strong>Marques représentées:</strong> {selectedEntite.marqueRepresentee || '-'}</p>
                  <p><strong>Présentation:</strong> {selectedEntite.presentation || '-'}</p>
                  <p><strong>Source:</strong> {selectedEntite.source || '-'}</p>
                </Col>
              </Row>
            </Container>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserEntitesList; 