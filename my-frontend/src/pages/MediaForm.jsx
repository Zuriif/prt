// src/pages/MediaForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMediaById, createMedia, updateMedia, uploadMedia } from "../services/mediaService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTimes,
  faArrowLeft,
  faUpload,
  faImage,
  faLink,
  faAlignLeft
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../contexts/AuthContext";

export default function MediaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isEdit = Boolean(id);

  const empty = {
    nomFichier: "",
    url: "",
    description: "",
    entiteId: null
  };

  const [form, setForm] = useState(empty);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      navigate("/user/dashboard");
      return;
    }

    if (isEdit) {
      setLoading(true);
      fetchMediaById(id)
        .then(({ data }) => {
          setForm({
            ...data,
            description: data.description || "",
          });
          // If there's an existing file, set the preview
          if (data.url) {
            setPreviewUrl(data.url);
          }
        })
        .catch((error) => {
          console.error('Error loading media:', error);
          if (error.response?.status === 401) {
            navigate("/login");
          } else {
            toast.error("Impossible de charger le média");
            navigate("/media");
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, user, navigate]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL for the selected file
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "ADMIN") {
      navigate("/user/dashboard");
      return;
    }

    setLoading(true);
    try {
      let mediaData = { ...form };

      // If there's a new file selected, upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        if (form.description) {
          formData.append("description", form.description);
        }
        if (form.entiteId) {
          formData.append("entiteId", form.entiteId);
        }
        
        const uploadResponse = await uploadMedia(formData);
        if (uploadResponse?.data) {
          mediaData = {
            ...mediaData,
            nomFichier: selectedFile.name,
            type: selectedFile.type,
            ...uploadResponse.data
          };
        }
      }

      if (isEdit) {
        await updateMedia(id, mediaData);
        toast.success("Média mis à jour");
      } else {
        await createMedia(mediaData);
        toast.success("Média créé");
      }
      navigate("/media");
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error("Erreur lors de l'enregistrement du média");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">
          {isEdit ? "Modifier le média" : "Nouveau média"}
        </h1>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/media")}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Retour
        </button>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">
                <FontAwesomeIcon icon={faUpload} className="me-2" />
                Fichier
              </label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileSelect}
                accept="image/*"
              />
              {previewUrl && (
                <div className="mt-2">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }} 
                    className="border rounded"
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">
                <FontAwesomeIcon icon={faImage} className="me-2" />
                Nom du fichier
              </label>
              <input
                type="text"
                className="form-control"
                value={form.nomFichier}
                onChange={e => setForm({ ...form, nomFichier: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <FontAwesomeIcon icon={faLink} className="me-2" />
                URL
              </label>
              <input
                type="text"
                className="form-control"
                value={form.url}
                onChange={e => setForm({ ...form, url: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">
                <FontAwesomeIcon icon={faAlignLeft} className="me-2" />
                Description
              </label>
              <textarea
                className="form-control"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows="3"
                placeholder="Ajouter une description ou une actualité liée à l'image..."
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <FontAwesomeIcon icon={faSave} className="me-2" />
                {isEdit ? "Mettre à jour" : "Créer"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/media")}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTimes} className="me-2" />
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}