import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Container } from 'react-bootstrap';

const UserDashboard = () => {
  return (
    <Container className="mt-4">
      <h2 className="mb-4">Tableau de bord utilisateur</h2>
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Produits</Card.Title>
              <Card.Text>
                Consulter les produits disponibles
              </Card.Text>
              <Link to="/user/produits" className="btn btn-primary">
                Voir les produits
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Mon Profil</Card.Title>
              <Card.Text>
                Gérer mes informations personnelles
              </Card.Text>
              <Link to="/user/profile" className="btn btn-primary">
                Voir mon profil
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Entités</Card.Title>
              <Card.Text>
                Consulter les entités disponibles
              </Card.Text>
              <Link to="/user/entites" className="btn btn-primary">
                Voir les entités
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard; 