import React, { useState, useEffect } from 'react';
import { Table, Container, Form, InputGroup, Alert, Modal, Row, Col } from 'react-bootstrap';
import client from '../../api/axiosClient';

const UserProduitsList = () => {
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      console.log('Fetching products...');
      const response = await client.get('/api/produits');
      console.log('Products response:', response.data);
      setProduits(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.response?.data?.message || 'Erreur lors de la récupération des produits');
      setLoading(false);
    }
  };

  const handleRowClick = (produit) => {
    setSelectedProduit(produit);
    setShowModal(true);
  };

  const filteredProduits = produits.filter(produit => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      produit?.nom?.toLowerCase().includes(searchTermLower) ||
      produit?.description?.toLowerCase().includes(searchTermLower) ||
      produit?.categorie?.toLowerCase().includes(searchTermLower)
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
      <h2 className="mb-4">Liste des Produits</h2>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nom du Produit</th>
          </tr>
        </thead>
        <tbody>
          {filteredProduits.map((produit) => (
            <tr 
              key={produit.id}
              onClick={() => handleRowClick(produit)}
              style={{ cursor: 'pointer' }}
            >
              <td>{produit.nom || '-'}</td>
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
          <Modal.Title>Détails du Produit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduit && (
            <Container fluid>
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Informations Générales</h5>
                  <p><strong>Nom:</strong> {selectedProduit.nom || '-'}</p>
                  <p><strong>Catégorie:</strong> {selectedProduit.categorie || '-'}</p>
                  <p><strong>Prix:</strong> {selectedProduit.prix ? `${selectedProduit.prix} €` : '-'}</p>
                </Col>
                <Col md={6}>
                  <h5>Description</h5>
                  <p>{selectedProduit.description || '-'}</p>
                </Col>
              </Row>
            </Container>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserProduitsList; 