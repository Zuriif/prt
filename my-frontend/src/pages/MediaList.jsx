// src/pages/MediaList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  fetchMedia,
  downloadMedia,
  deleteMedia,
} from "../services/mediaService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function MediaList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    setLoading(true);
    try {
      const res = await fetchMedia();
      setFiles(res.data);
    } catch {
      toast.error("Erreur de chargement des médias");
    } finally {
      setLoading(false);
    }
  }

  // Filtre & pagination
  const filtered = files.filter(f =>
    f.nomFichier.toLowerCase().includes(search.toLowerCase())
  );
  const totalItems = filtered.length;
  const pageCount = Math.ceil(totalItems / pageSize);
  const startIdx = (page - 1) * pageSize;
  const paged = filtered.slice(startIdx, startIdx + pageSize);

  // Sélection
  const allSelected = paged.length > 0 && paged.every(f => selectedIds.has(f.id));
  const toggleAll = () => {
    const s = new Set(selectedIds);
    if (allSelected) {
      paged.forEach(f => s.delete(f.id));
    } else {
      paged.forEach(f => s.add(f.id));
    }
    setSelectedIds(s);
  };
  const toggleOne = id => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm("Supprimer les médias sélectionnés ?")) return;
    try {
      await Promise.all([...selectedIds].map(id => deleteMedia(id)));
      toast.success("Médias supprimés");
      setSelectedIds(new Set());
      loadFiles();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Download file
  const handleDownload = async id => {
    try {
      const response = await downloadMedia(id);
      const blob = response.data;
      const filename = files.find(f => f.id === id)?.nomFichier || 'download';
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Erreur de téléchargement");
    }
  };

  const handleView = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedia(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Gestion des médias</h1>
        <div>
          <button
            className="btn btn-danger me-2"
            disabled={!selectedIds.size}
            onClick={handleBulkDelete}
          >
            Delete
          </button>
          <Link to="/media/new" className="btn btn-success">
            + Add New Media
          </Link>
        </div>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par nom de fichier..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div>Chargement…</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th>ID</th>
                <th>Nom de fichier</th>
                <th>Type</th>
                <th>Entité ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map(f => (
                <tr key={f.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(f.id)}
                      onChange={() => toggleOne(f.id)}
                    />
                  </td>
                  <td>{f.id}</td>
                  <td>{f.nomFichier}</td>
                  <td>{f.type}</td>
                  <td>{f.entiteId}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleDownload(f.id)}
                    >
                      Télécharger
                    </button>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleView(f)}
                    >
                      View
                    </button>
                    <Link
                      to={`/media/${f.id}`}
                      className="btn btn-sm btn-warning me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={async () => {
                        if (window.confirm("Supprimer ce média ?")) {
                          await deleteMedia(f.id);
                          loadFiles();
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mt-3">
        <small className="text-muted">
          {startIdx + 1}–{startIdx + paged.length} sur {totalItems}
        </small>
        <nav>
          <ul className="pagination mb-0">
            <li className={`page-item ${page === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setPage(p => Math.max(p - 1, 1))}
              >
                Précédent
              </button>
            </li>
            {[...Array(pageCount)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 && "active"}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === pageCount && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => setPage(p => Math.min(p + 1, pageCount))}
              >
                Suivant
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <ToastContainer position="top-center" />

      {/* Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Détails du Média</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMedia && (
            <div>
              <p><strong>ID:</strong> {selectedMedia.id}</p>
              <p><strong>Nom:</strong> {selectedMedia.nomFichier}</p>
              <p><strong>Description:</strong> {selectedMedia.description}</p>
              {selectedMedia.url && (
                <img src={selectedMedia.url} alt={selectedMedia.nomFichier} style={{ maxWidth: '100%' }} />
              )}
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
