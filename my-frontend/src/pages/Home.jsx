// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { FaUsers, FaBuilding, FaBox, FaChartLine, FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import client from '../api/axiosClient';
import '../style/Dashboard.css';

import {
  PieChart, Pie, Cell, Legend, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

const Home = () => {
  const [stats, setStats] = useState({
    users: 0,
    entites: 0,
    produits: 0,
    total: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch users
      const usersResponse = await client.get('/api/auth/users');
      const users = usersResponse.data;
      
      // Fetch entites
      const entitesResponse = await client.get('/api/entites');
      const entites = entitesResponse.data;
      
      // Fetch produits
      const produitsResponse = await client.get('/api/produits');
      const produits = produitsResponse.data;

      setStats({
        users: users.length,
        entites: entites.length,
        produits: produits.length,
        total: users.length + entites.length + produits.length
      });

      // Get 5 most recent users
      setRecentUsers(users.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erreur lors du chargement des données du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="stat-card dashboard-card">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="stat-label">{title}</h6>
          <h3 className="stat-value mb-0">{value}</h3>
        </div>
        <div className={`icon-container bg-${color} bg-opacity-10`}>
          <Icon className={`text-${color}`} size={24} />
        </div>
      </div>
    </div>
  );

  const QuickAccessCard = ({ title, description, icon: Icon, color, link }) => (
    <div className="quick-access-card dashboard-card">
      <div className="d-flex align-items-center mb-3">
        <div className={`icon-container bg-${color} bg-opacity-10`}>
          <Icon className={`text-${color}`} size={20} />
        </div>
        <h5 className="mb-0">{title}</h5>
      </div>
      <p className="text-muted mb-3">{description}</p>
      <Button variant={`outline-${color}`} href={link} className="w-100 action-button">
        Accéder
      </Button>
    </div>
  );

  if (loading) {
    return (
      <Container fluid className="dashboard-container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement du tableau de bord...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="dashboard-container py-4">
      <ToastContainer position="top-center" />
      
      {/* Welcome Section */}
      <div className="welcome-section">
        <h2>Tableau de bord</h2>
        <p>Bienvenue dans votre espace d'administration</p>
      </div>

      {/* Statistics Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <StatCard
            title="Utilisateurs"
            value={stats.users}
            icon={FaUsers}
            color="primary"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Entités"
            value={stats.entites}
            icon={FaBuilding}
            color="success"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Produits"
            value={stats.produits}
            icon={FaBox}
            color="warning"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Total"
            value={stats.total}
            icon={FaChartLine}
            color="info"
          />
        </Col>
      </Row>

      <Row className="g-4">
        {/* Recent Users Table */}
        <Col md={8}>
          <Card className="dashboard-card">
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Utilisateurs récents</h5>
                <Button variant="outline-primary" size="sm" href="/users" className="action-button">
                  Voir tout
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="dashboard-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nom}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge bg-${user.role?.nom === 'ADMIN' ? 'danger' : 'primary'}`}>
                          {user.role?.nom}
                        </span>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2 action-button">
                          <FaEdit />
                        </Button>
                        <Button variant="outline-danger" size="sm" className="action-button">
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Access Cards */}
        <Col md={4}>
          <Row className="g-4">
            <Col md={12}>
              <QuickAccessCard
                title="Gestion des utilisateurs"
                description="Créer, modifier et gérer les utilisateurs du système"
                icon={FaUserPlus}
                color="primary"
                link="/users"
              />
            </Col>
            <Col md={12}>
              <QuickAccessCard
                title="Gestion des entités"
                description="Gérer les entités et leurs informations"
                icon={FaBuilding}
                color="success"
                link="/entites"
              />
            </Col>
            <Col md={12}>
              <QuickAccessCard
                title="Gestion des produits"
                description="Gérer le catalogue des produits"
                icon={FaBox}
                color="warning"
                link="/produits"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
