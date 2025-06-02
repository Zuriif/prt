import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import client from '../../api/axiosClient';
import { fetchSecteurs } from '../../services/secteurService';
import '../../style/Dashboard.css';
import logo from '../../assets/react.svg';
import { Link } from 'react-router-dom';

const UserHome = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [secteurs, setSecteurs] = useState([]);
  const [media, setMedia] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [products, setProducts] = useState([]);
  const [entities, setEntities] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [searchType, setSearchType] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchSecteurs().then(({ data }) => data),
      client.get('/api/media').then(res => res.data),
      client.get('/api/produits').then(res => res.data),
      client.get('/api/entites').then(res => res.data)
    ]).then(async ([secteursData, mediaList, productsList, entitiesList]) => {
      setSecteurs(Array.isArray(secteursData) ? secteursData : []);
      setMedia(Array.isArray(mediaList) ? mediaList : []);
      setProducts(Array.isArray(productsList) ? productsList : []);
      setEntities(Array.isArray(entitiesList) ? entitiesList : []);
      const urls = {};
      await Promise.all((mediaList || []).map(async (item) => {
        try {
          const response = await client.get(`/api/media/download/${item.id}`, { responseType: 'blob' });
          urls[item.id] = URL.createObjectURL(response.data);
        } catch (e) {
          urls[item.id] = null;
        }
      }));
      setImageUrls(urls);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return;
    // Search secteur
    const secteur = secteurs.find(s => (s.nom || '').toLowerCase().includes(term));
    if (secteur) {
      setSearchResult(secteur);
      setSearchType('secteur');
      return;
    }
    // Search product
    const product = products.find(p => (p.nom || '').toLowerCase().includes(term));
    if (product) {
      setSearchResult(product);
      setSearchType('product');
      return;
    }
    // Search entity
    const entity = entities.find(e => (e.libelle || '').toLowerCase().includes(term));
    if (entity) {
      setSearchResult(entity);
      setSearchType('entity');
      return;
    }
    setSearchResult('notfound');
    setSearchType(null);
  };

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
    <div className="home-root" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <ToastContainer position="top-center" />
      {/* Hero/Sector Section */}
      <div className="hero-section position-relative" style={{ background: 'linear-gradient(90deg, #fff 60%, #e74c3c11 100%)', padding: '2.5rem 0 2rem 0', minHeight: 320 }}>
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-4">
            {secteurs.map((secteur, idx) => (
              <span key={secteur.id || idx} className="sector-badge px-3 py-2 fw-bold shadow-sm" style={{ background: '#2c3e50', color: '#fff', borderRadius: 8, fontSize: 16, boxShadow: '0 2px 8px #0001' }}>
                {secteur.nom}
              </span>
            ))}
          </div>
          {/* Agency banner */}
          <div className="text-center mb-3">
            <span style={{ color: '#c0392b', fontWeight: 600, fontSize: 18 }}>Agence Marocaine de Développement des Investissements et des Exportations</span>
          </div>
          {/* Search Bar */}
          <div className="d-flex justify-content-center">
            <InputGroup style={{ maxWidth: 500 }}>
              <Form.Control
                placeholder="Rechercher un secteur, exportateur..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
              />
              <Button variant="danger" onClick={handleSearch}>
                <FaSearch /> Rechercher
              </Button>
            </InputGroup>
          </div>
          {/* Search Result */}
          {searchResult && (
            <div className="mt-3">
              {searchResult === 'notfound' && <div className="alert alert-warning">Aucun résultat trouvé.</div>}
              {searchType === 'secteur' && (
                <Card className="mb-3"><Card.Body><h5>Secteur: {searchResult.nom}</h5><p>{searchResult.description}</p></Card.Body></Card>
              )}
              {searchType === 'product' && (
                <Card className="mb-3"><Card.Body><h5>Produit: {searchResult.nom}</h5><p>{searchResult.description}</p></Card.Body></Card>
              )}
              {searchType === 'entity' && (
                <Card className="mb-3"><Card.Body><h5>Entité: {searchResult.libelle}</h5><p>Type: {searchResult.typeEntreprise?.libelle}</p><p>Adresse: {searchResult.adresse}</p></Card.Body></Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Media/News Section */}
      <div className="container mb-5">
        <h4 className="mb-4" style={{ color: '#c0392b', fontWeight: 600 }}>Actualités & Médias</h4>
        <Row className="g-4">
          {media.map((item, idx) => (
            <Col md={6} key={item.id || idx}>
              <Link to={`/user/media/${item.id}`} style={{ textDecoration: 'none' }}>
                <Card className="media-card h-100 shadow-sm" style={{ border: 'none', borderRadius: 16 }}>
                  {imageUrls[item.id] && (
                    <Card.Img variant="top" src={imageUrls[item.id]} style={{ height: 250, objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />
                  )}
                  <Card.Body>
                    <h5 className="fw-bold mb-2">{item.nomFichier}</h5>
                    <div className="text-muted mb-2" style={{ fontSize: 13 }}>{item.dateUpload ? new Date(item.dateUpload).toLocaleDateString() : ''}</div>
                    <p style={{ fontSize: 16 }}>{item.description || item.nomFichier}</p>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
          {media.length === 0 && (
            <p className="text-muted">Aucun média public pour le moment.</p>
          )}
        </Row>
      </div>
    </div>
  );
};

export default UserHome; 