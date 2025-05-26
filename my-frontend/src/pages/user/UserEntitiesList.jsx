import React, { useState, useEffect } from 'react';
import { Table, Container, Form, InputGroup, Alert, Modal, Row, Col, Accordion } from 'react-bootstrap';
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
            <Accordion>
              {/* Informations Générales */}
              {Object.entries({
                id: "ID",
                libelle: "Nom",
                numMB: "Numéro MB",
                description: "Description",
                typeEntreprise: "Type d'entreprise",
                createdAt: "Date de création",
                type: "Type",
                SH: "SH",
                risk: "Risk",
                tome: "Tome",
                region: "Région",
                standard: "Standard"
              }).some(([key]) => selectedEntite[key]) && (
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Informations Générales</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        {selectedEntite.id && <p><strong>ID:</strong> {selectedEntite.id}</p>}
                        {selectedEntite.libelle && <p><strong>Nom:</strong> {selectedEntite.libelle}</p>}
                        {selectedEntite.numMB && <p><strong>Numéro MB:</strong> {selectedEntite.numMB}</p>}
                        {selectedEntite.description && <p><strong>Description:</strong> {selectedEntite.description}</p>}
                        {selectedEntite.typeEntreprise && <p><strong>Type d'entreprise:</strong> {selectedEntite.typeEntreprise.libelle}</p>}
                        {selectedEntite.createdAt && <p><strong>Date de création:</strong> {new Date(selectedEntite.createdAt).toLocaleDateString()}</p>}
                      </Col>
                      <Col md={6}>
                        {selectedEntite.type && <p><strong>Type:</strong> {selectedEntite.type}</p>}
                        {selectedEntite.SH && <p><strong>SH:</strong> {selectedEntite.SH}</p>}
                        {selectedEntite.risk && <p><strong>Risk:</strong> {selectedEntite.risk}</p>}
                        {selectedEntite.tome && <p><strong>Tome:</strong> {selectedEntite.tome}</p>}
                        {selectedEntite.region && <p><strong>Région:</strong> {selectedEntite.region}</p>}
                        {selectedEntite.standard && <p><strong>Standard:</strong> {selectedEntite.standard}</p>}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {/* Informations de Contact */}
              {Object.entries({
                telephone: "Téléphone",
                pays: "Pays",
                codeFiscal: "Code Fiscal",
                ice: "ICE",
                patente: "Patente",
                rc: "RC",
                cnss: "CNSS"
              }).some(([key]) => selectedEntite[key]) && (
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Informations de Contact</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        {selectedEntite.telephone && <p><strong>Téléphone:</strong> {selectedEntite.telephone}</p>}
                        {selectedEntite.pays && <p><strong>Pays:</strong> {selectedEntite.pays}</p>}
                        {selectedEntite.codeFiscal && <p><strong>Code Fiscal:</strong> {selectedEntite.codeFiscal}</p>}
                        {selectedEntite.ice && <p><strong>ICE:</strong> {selectedEntite.ice}</p>}
                      </Col>
                      <Col md={6}>
                        {selectedEntite.patente && <p><strong>Patente:</strong> {selectedEntite.patente}</p>}
                        {selectedEntite.rc && <p><strong>RC:</strong> {selectedEntite.rc}</p>}
                        {selectedEntite.cnss && <p><strong>CNSS:</strong> {selectedEntite.cnss}</p>}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {/* Informations Business */}
              {selectedEntite.entiteBusiness && Object.values(selectedEntite.entiteBusiness).some(value => value) && (
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Informations Business</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        {selectedEntite.entiteBusiness.type && <p><strong>Type:</strong> {selectedEntite.entiteBusiness.type}</p>}
                        {selectedEntite.entiteBusiness.effectif && <p><strong>Effectif:</strong> {selectedEntite.entiteBusiness.effectif}</p>}
                        {selectedEntite.entiteBusiness.capital && <p><strong>Capital:</strong> {selectedEntite.entiteBusiness.capital}</p>}
                        {selectedEntite.entiteBusiness.formeJuridique && <p><strong>Forme Juridique:</strong> {selectedEntite.entiteBusiness.formeJuridique}</p>}
                        {selectedEntite.entiteBusiness.dateCreation && <p><strong>Date de Création:</strong> {selectedEntite.entiteBusiness.dateCreation}</p>}
                      </Col>
                      <Col md={6}>
                        {selectedEntite.entiteBusiness.activite && <p><strong>Activité:</strong> {selectedEntite.entiteBusiness.activite}</p>}
                        {selectedEntite.entiteBusiness.secteur && <p><strong>Secteur:</strong> {selectedEntite.entiteBusiness.secteur}</p>}
                        {selectedEntite.entiteBusiness.sousSecteur && <p><strong>Sous Secteur:</strong> {selectedEntite.entiteBusiness.sousSecteur}</p>}
                        {selectedEntite.entiteBusiness.presentation && <p><strong>Présentation:</strong> {selectedEntite.entiteBusiness.presentation}</p>}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {/* Contact Détaillé */}
              {selectedEntite.entiteContact && Object.values(selectedEntite.entiteContact).some(value => value) && (
                <Accordion.Item eventKey="3">
                  <Accordion.Header>Contact Détaillé</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        {selectedEntite.entiteContact.email && <p><strong>Email:</strong> {selectedEntite.entiteContact.email}</p>}
                        {selectedEntite.entiteContact.gsm && <p><strong>GSM:</strong> {selectedEntite.entiteContact.gsm}</p>}
                        {selectedEntite.entiteContact.fax && <p><strong>Fax:</strong> {selectedEntite.entiteContact.fax}</p>}
                        {selectedEntite.entiteContact.siteWeb && <p><strong>Site Web:</strong> {selectedEntite.entiteContact.siteWeb}</p>}
                      </Col>
                      <Col md={6}>
                        {selectedEntite.entiteContact.boitePostal && <p><strong>Boîte Postale:</strong> {selectedEntite.entiteContact.boitePostal}</p>}
                        {selectedEntite.entiteContact.adresse && <p><strong>Adresse:</strong> {selectedEntite.entiteContact.adresse}</p>}
                        {selectedEntite.entiteContact.ville && <p><strong>Ville:</strong> {selectedEntite.entiteContact.ville}</p>}
                        {selectedEntite.entiteContact.codePostal && <p><strong>Code Postal:</strong> {selectedEntite.entiteContact.codePostal}</p>}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {/* Produits et Services */}
              {selectedEntite.entiteProducts && Object.values(selectedEntite.entiteProducts).some(value => value) && (
                <Accordion.Item eventKey="4">
                  <Accordion.Header>Produits et Services</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        {selectedEntite.entiteProducts.produits && <p><strong>Produits:</strong> {selectedEntite.entiteProducts.produits}</p>}
                        {selectedEntite.entiteProducts.certifs && <p><strong>Certifications:</strong> {selectedEntite.entiteProducts.certifs}</p>}
                        {selectedEntite.entiteProducts.partenaires && <p><strong>Partenaires:</strong> {selectedEntite.entiteProducts.partenaires}</p>}
                        {selectedEntite.entiteProducts.marquesCommerciales && <p><strong>Marques Commerciales:</strong> {selectedEntite.entiteProducts.marquesCommerciales}</p>}
                      </Col>
                      <Col md={6}>
                        {selectedEntite.entiteProducts.capacite && <p><strong>Capacité:</strong> {selectedEntite.entiteProducts.capacite}</p>}
                        {selectedEntite.entiteProducts.puissance && <p><strong>Puissance:</strong> {selectedEntite.entiteProducts.puissance}</p>}
                        {selectedEntite.entiteProducts.specialite && <p><strong>Spécialité:</strong> {selectedEntite.entiteProducts.specialite}</p>}
                        {selectedEntite.entiteProducts.activites && <p><strong>Activités:</strong> {selectedEntite.entiteProducts.activites}</p>}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {/* Localisation */}
              {selectedEntite.entiteLocation && Object.values(selectedEntite.entiteLocation).some(value => value) && (
                <Accordion.Item eventKey="5">
                  <Accordion.Header>Localisation</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        {selectedEntite.entiteLocation.administration && <p><strong>Administration:</strong> {selectedEntite.entiteLocation.administration}</p>}
                        {selectedEntite.entiteLocation.ports && <p><strong>Ports:</strong> {selectedEntite.entiteLocation.ports}</p>}
                        {selectedEntite.entiteLocation.cheminDeFer && <p><strong>Chemin de Fer:</strong> {selectedEntite.entiteLocation.cheminDeFer}</p>}
                        {selectedEntite.entiteLocation.enseignement && <p><strong>Enseignement:</strong> {selectedEntite.entiteLocation.enseignement}</p>}
                      </Col>
                      <Col md={6}>
                        {selectedEntite.entiteLocation.gouvernorat && <p><strong>Gouvernorat:</strong> {selectedEntite.entiteLocation.gouvernorat}</p>}
                        {selectedEntite.entiteLocation.region && <p><strong>Région:</strong> {selectedEntite.entiteLocation.region}</p>}
                        {selectedEntite.entiteLocation.villeIndependante && <p><strong>Ville:</strong> {selectedEntite.entiteLocation.villeIndependante}</p>}
                        {selectedEntite.entiteLocation.commune && <p><strong>Commune:</strong> {selectedEntite.entiteLocation.commune}</p>}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {/* Médias */}
              {selectedEntite.entiteMedia && Object.values(selectedEntite.entiteMedia).some(value => value) && (
                <Accordion.Item eventKey="6">
                  <Accordion.Header>Médias</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        {selectedEntite.entiteMedia.logo && <p><strong>Logo:</strong> {selectedEntite.entiteMedia.logo}</p>}
                        {selectedEntite.entiteMedia.image1 && <p><strong>Image 1:</strong> {selectedEntite.entiteMedia.image1}</p>}
                        {selectedEntite.entiteMedia.image2 && <p><strong>Image 2:</strong> {selectedEntite.entiteMedia.image2}</p>}
                        {selectedEntite.entiteMedia.image3 && <p><strong>Image 3:</strong> {selectedEntite.entiteMedia.image3}</p>}
                      </Col>
                      <Col md={6}>
                        {selectedEntite.entiteMedia.video1 && <p><strong>Vidéo 1:</strong> {selectedEntite.entiteMedia.video1}</p>}
                        {selectedEntite.entiteMedia.video2 && <p><strong>Vidéo 2:</strong> {selectedEntite.entiteMedia.video2}</p>}
                        {selectedEntite.entiteMedia.video3 && <p><strong>Vidéo 3:</strong> {selectedEntite.entiteMedia.video3}</p>}
                        {selectedEntite.entiteMedia.file && <p><strong>Fichier:</strong> {selectedEntite.entiteMedia.file}</p>}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              )}

              {/* Informations Additionnelles */}
              {selectedEntite.entiteAdditional && Object.values(selectedEntite.entiteAdditional).some(value => value) && (
                <Accordion.Item eventKey="7">
                  <Accordion.Header>Informations Additionnelles</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col md={6}>
                        {selectedEntite.entiteAdditional.keywords && <p><strong>Keywords:</strong> {selectedEntite.entiteAdditional.keywords}</p>}
                        {selectedEntite.entiteAdditional.caExport && <p><strong>CA Export:</strong> {selectedEntite.entiteAdditional.caExport}</p>}
                        {selectedEntite.entiteAdditional.maisonMere && <p><strong>Maison Mère:</strong> {selectedEntite.entiteAdditional.maisonMere}</p>}
                        {selectedEntite.entiteAdditional.groupe && <p><strong>Groupe:</strong> {selectedEntite.entiteAdditional.groupe}</p>}
                      </Col>
                      <Col md={6}>
                        {selectedEntite.entiteAdditional.population && <p><strong>Population:</strong> {selectedEntite.entiteAdditional.population}</p>}
                        {selectedEntite.entiteAdditional.nombreCommune && <p><strong>Nombre Commune:</strong> {selectedEntite.entiteAdditional.nombreCommune}</p>}
                        {selectedEntite.entiteAdditional.nombreDouar && <p><strong>Nombre Douar:</strong> {selectedEntite.entiteAdditional.nombreDouar}</p>}
                        {selectedEntite.entiteAdditional.domainesCompetence && <p><strong>Domaines de Compétence:</strong> {selectedEntite.entiteAdditional.domainesCompetence}</p>}
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              )}
            </Accordion>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Fermer</button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserEntitesList; 