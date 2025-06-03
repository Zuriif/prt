import React, { useState, useEffect } from 'react';
import { Table, Container, Form, InputGroup, Alert, Modal, Button, Spinner } from 'react-bootstrap';
import client from '../api/axiosClient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'USER'
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await client.get('/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Erreur lors de la récupération des utilisateurs');
      toast.error('Impossible de charger la liste des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdating(true);
      await client.put(`/api/auth/users/${userId}/role`, { role: newRole });
      toast.success('Rôle mis à jour avec succès');
      await fetchUsers();
      setShowModal(false);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setUpdating(true);
      await client.post('/api/auth/users', formData);
      toast.success('Utilisateur créé avec succès');
      await fetchUsers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setUpdating(true);
      await client.put(`/api/auth/users/${selectedUser.id}`, formData);
      toast.success('Utilisateur mis à jour avec succès');
      await fetchUsers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setUpdating(true);
      await client.delete(`/api/auth/users/${selectedUser.id}`);
      toast.success('Utilisateur supprimé avec succès');
      await fetchUsers();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setUpdating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      email: '',
      motDePasse: '',
      role: 'USER'
    });
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      nom: user.nom || '',
      email: user.email || '',
      motDePasse: '',
      role: user.role?.nom || 'USER'
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleCreateClick = () => {
    resetForm();
    setShowModal(true);
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.nom?.toLowerCase().includes(searchTermLower) ||
      user.email?.toLowerCase().includes(searchTermLower) ||
      user.role?.nom?.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="mt-2">Chargement des utilisateurs...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchUsers}>
            Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestion des Utilisateurs</h2>
        <Button variant="primary" onClick={handleCreateClick}>
          Créer un utilisateur
        </Button>
      </div>
      
      <InputGroup className="mb-4">
        <Form.Control
          placeholder="Rechercher un utilisateur par nom, email ou rôle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button 
            variant="outline-secondary" 
            onClick={() => setSearchTerm('')}
          >
            Effacer
          </Button>
        )}
      </InputGroup>

      {filteredUsers.length === 0 ? (
        <Alert variant="info">
          {searchTerm 
            ? "Aucun utilisateur ne correspond à votre recherche"
            : "Aucun utilisateur trouvé"}
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge bg-${user.role?.nom === 'ADMIN' ? 'danger' : 'primary'}`}>
                    {user.role?.nom}
                  </span>
                </td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditClick(user)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal pour créer/modifier un utilisateur */}
      <Modal
        show={showModal}
        onHide={() => !updating && (setShowModal(false), resetForm())}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                disabled={updating}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={updating}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mot de passe {isEditing && '(laisser vide pour ne pas modifier)'}</Form.Label>
              <Form.Control
                type="password"
                value={formData.motDePasse}
                onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                disabled={updating}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rôle</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={updating}
              >
                <option value="USER">Utilisateur</option>
                <option value="ADMIN">Administrateur</option>
              </Form.Select>
            </Form.Group>
          </Form>
          {updating && (
            <div className="text-center mt-3">
              <Spinner animation="border" size="sm" />
              <span className="ms-2">Traitement en cours...</span>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={updating}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={isEditing ? handleUpdateUser : handleCreateUser}
            disabled={updating}
          >
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        show={showDeleteModal}
        onHide={() => !updating && setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser?.nom} ?
          Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={updating}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteUser} disabled={updating}>
            {updating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Suppression...
              </>
            ) : (
              'Supprimer'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" />
    </Container>
  );
};

export default UserManagement;