import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedImage } from '../utils/shareService';
import '../styles/SharedView.css';

export default function SharedView() {
  const { id } = useParams<{ id: string }>();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    loadSharedImage(id);
  }, [id]);

  const loadSharedImage = async (shareId: string) => {
    setIsLoading(true);
    const url = await getSharedImage(shareId);

    if (!url) {
      setNotFound(true);
    } else {
      setImageUrl(url);
    }

    setIsLoading(false);
  };

  const handleDownload = () => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `collage-${id}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="shared-view">
      {isLoading && (
        <div className="shared-state">
          <p>Loading collage...</p>
        </div>
      )}

      {!isLoading && notFound && (
        <div className="shared-state">
          <h2>Collage not found</h2>
          <p>This link might be broken, or the collage was removed.</p>
          <Link to="/" className="btn btn-primary">
            Create Your Own
          </Link>
        </div>
      )}

      {!isLoading && imageUrl && (
        <div className="shared-content">
          <img src={imageUrl} alt="Shared collage" className="shared-image" />

          <div className="shared-actions">
            <button className="btn btn-primary btn-large" onClick={handleDownload}>
              📥 Download
            </button>
            <Link to="/" className="btn btn-secondary btn-large">
              Create Your Own
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}