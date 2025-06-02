import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import client from '../../api/axiosClient';
import '../../style/MediaDetail.css';

const MediaDetail = () => {
    const { mediaId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [mediaItem, setMediaItem] = useState(null);
    const [mediaUrl, setMediaUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMediaDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch media item details (name, description, etc.)
                const detailResponse = await client.get(`/api/media/${mediaId}`);
                const item = detailResponse.data;
                setMediaItem(item);

                // Fetch the media file blob
                const fileResponse = await client.get(`/api/media/download/${mediaId}`, { responseType: 'blob' });
                const blob = fileResponse.data;
                const contentType = fileResponse.headers['content-type'];

                let url = null;
                let type = 'other'; // Default type is other

                if (contentType) {
                    if (contentType.startsWith('image/')) {
                        type = 'image';
                    } else if (contentType.startsWith('video/')) {
                        type = 'video';
                    }
                }

                if (type !== 'other') {
                     url = URL.createObjectURL(blob);
                     setMediaUrl({ url, type });
                } else {
                    // For other types, provide a download link
                    setMediaUrl({ url: `/api/media/download/${mediaId}`, type: 'download' });
                }


            } catch (err) {
                console.error('Error fetching media detail:', err);
                 setError("Erreur lors du chargement du média.");
                 toast.error("Erreur lors du chargement du média.");
            } finally {
                setLoading(false);
            }
        };

        if (mediaId) {
            fetchMediaDetail();
        } else {
            setError("Aucun ID média fourni.");
             setLoading(false);
        }

         // Clean up the object URL when the component unmounts
         return () => {
             if (mediaUrl && mediaUrl.type !== 'download' && mediaUrl.url) {
                 URL.revokeObjectURL(mediaUrl.url);
             }
         };

    }, [mediaId]); // Rerun effect if mediaId changes

    if (loading) {
        return (
             <Container className="mt-5 text-center media-detail-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </Spinner>
                <p className="mt-2">Chargement du média...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5 media-detail-container">
                <Alert variant="danger">{error}</Alert>
                 <Button variant="primary" onClick={() => navigate(-1)}>Retour</Button>
            </Container>
        );
    }

    if (!mediaItem) {
        return (
             <Container className="mt-5 media-detail-container">
                 <Alert variant="warning">Média introuvable.</Alert>
                  <Button variant="primary" onClick={() => navigate(-1)}>Retour</Button>
             </Container>
         );
    }

    return (
        <Container className="mt-5 media-detail-container">
            <ToastContainer position="top-center" />
            <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4 media-detail-back-button">Retour</Button>
            <Card className="media-detail-card">
                {mediaUrl && mediaUrl.type === 'image' && (
                    <Card.Img variant="top" src={mediaUrl.url} style={{ maxHeight: '500px' }} className="media-detail-media" />
                )}
                 {mediaUrl && mediaUrl.type === 'video' && (
                    <Card.Body>
                        <video controls style={{ width: '100%', maxHeight: '500px' }} className="media-detail-media">
                            <source src={mediaUrl.url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </Card.Body>
                 )}
                 {mediaUrl && mediaUrl.type === 'download' && (
                     <Card.Body>
                         <p>Ce fichier ne peut pas être affiché directement. Vous pouvez le télécharger :</p>
                         <Button href={mediaUrl.url} download={mediaItem.nomFichier}>Télécharger {mediaItem.nomFichier}</Button>
                     </Card.Body>
                 )}

                <Card.Body>
                    <Card.Title className="fw-bold media-detail-title">{mediaItem.nomFichier}</Card.Title>
                    {mediaItem.description && <Card.Text className="media-detail-description">{mediaItem.description}</Card.Text>}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MediaDetail; 