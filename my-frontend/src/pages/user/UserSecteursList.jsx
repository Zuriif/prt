import React, { useState, useEffect } from "react";
import { fetchSecteurs } from "../../services/secteurService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function UserSecteursList() {
  const [secteurs, setSecteurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSecteur, setSelectedSecteur] = useState(null);

  useEffect(() => {
    loadSecteurs();
  }, []);

  const loadSecteurs = () => {
    fetchSecteurs()
      .then(({ data }) => setSecteurs(data))
      .catch(() => toast.error("Impossible de charger les secteurs"));
  };

  const handleView = (secteur) => {
    setSelectedSecteur(secteur);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSecteur(null);
  };

  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Secteurs</h1>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {secteurs.map(secteur => (
          <div key={secteur.id} className="col">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{secteur.nom}</h5>
                <p className="card-text text-muted">
                  {secteur.description?.substring(0, 100)}
                  {secteur.description?.length > 100 ? '...' : ''}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleView(secteur)}
                >
                  Voir les détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer position="top-center" />

      {/* Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails du Secteur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSecteur && (
            <div>
              <h4>{selectedSecteur.nom}</h4>
              <p className="mt-3">{selectedSecteur.description}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 