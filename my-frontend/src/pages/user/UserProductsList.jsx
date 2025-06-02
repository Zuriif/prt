import React, { useState, useEffect } from 'react';
import { Table, Container, Form, InputGroup, Alert, Modal, Row, Col, Card, Button } from 'react-bootstrap';
import client from '../../api/axiosClient';
import './/UserProductsList.css'; // Import the CSS file

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

  const handleCardClick = (produit) => {
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

      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {filteredProduits.map((produit) => (
          <Col key={produit.id}>
            <Card 
              className="product-card" // Apply the CSS class
              onClick={() => handleCardClick(produit)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Img 
                variant="top" 
                src={produit.images || 'https://via.placeholder.com/200?text=No+Image'} // Placeholder if no image
                style={{ height: '180px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{produit.nom || '-'}</Card.Title>
                <Card.Text>
                  Catégorie: {produit.categorie || '-'}
                </Card.Text>
                <Card.Text>
                  Prix: {produit.prix ? `${produit.prix} MAD` : '-'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

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
              {selectedProduit.images && (
                <Row className="mb-3 justify-content-center">
                  <Col xs={12} md={8} className="text-center">
                    <img
                      src={selectedProduit.images}
                      alt={selectedProduit.nom || 'Product Image'}
                      className="img-fluid rounded"
                      style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                    />
                  </Col>
                </Row>
              )}
              <Row className="mb-3">
                <Col md={6}>
                  <h5>Informations Générales</h5>
                  <p><strong>Nom:</strong> {selectedProduit.nom || '-'}</p>
                  <p><strong>Catégorie:</strong> {selectedProduit.categorie || '-'}</p>
                  <p><strong>Prix:</strong> {selectedProduit.prix ? `${selectedProduit.prix} MAD` : '-'}</p>
                </Col>
                <Col md={6}>
                  <h5>Description</h5>
                  <p>{selectedProduit.description || '-'}</p>
                </Col>
              </Row>
            </Container>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Fermer</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserProduitsList; 