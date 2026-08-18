import { useRef, useState } from 'react';
import type { Photo, Layout, Mode } from '../types/index';
import type { Theme } from '../data/themes';
import '../styles/ShareDownload.css';

interface ShareDownloadProps {
  photos: Photo[];
  theme: Theme;
  layout: Layout;
  mode: Mode;
  isLoading: boolean;
  onBack: () => void;
}

export default function ShareDownload({
  isLoading,
  onBack,
}: ShareDownloadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  // ====================
  // DOWNLOAD
  // ====================

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    // Convert canvas to blob
    canvasRef.current.toBlob((blob) => {
      if (!blob) return;

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `collage-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  // ====================
  // SHARE (via Supabase)
  // ====================

  const handleShare = async () => {
    if (!canvasRef.current) return;

    setShareLoading(true);

    try {
      // Convert canvas to blob
        await new Promise<void>((resolve) => {
          canvasRef.current!.toBlob(() => resolve(), 'image/png');
      });

    

      const mockShareId = Math.random().toString(36).substr(2, 9);
      const mockShareLink = `${window.location.origin}/share/${mockShareId}`;
      
      setShareLink(mockShareLink);
    } catch (error) {
      console.error('Share failed:', error);
      alert('Could not create share link. Try downloading instead.');
    } finally {
      setShareLoading(false);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    if (!shareLink) return;

    navigator.clipboard.writeText(shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ====================
  // RENDER
  // ====================

  return (
    <div className="share-download">
      <div className="share-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2>Share or Download</h2>
        <div className="spacer"></div>
      </div>

      <div className="share-container">
        {/* Success message */}
        {shareLink && (
          <div className="share-success">
            <h3>✨ Your link is ready!</h3>
            <p>Share this with friends:</p>
            
            <div className="share-link-box">
              <input 
                type="text" 
                value={shareLink} 
                readOnly 
                className="share-link-input"
              />
              <button 
                className="btn btn-primary"
                onClick={handleCopyLink}
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="share-info">
              <p>🔓 Anyone with the link can view it</p>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {!shareLink && (
          <div className="share-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={handleDownload}
              disabled={isLoading}
            >
              📥 Download to Phone
            </button>

            <p className="or-text">or</p>

            <button 
              className="btn btn-secondary btn-large"
              onClick={handleShare}
              disabled={shareLoading || isLoading}
            >
              {shareLoading ? 'Creating link...' : '🔗 Get Share Link'}
            </button>
          </div>
        )}

        {/* Loading state */}
        {(isLoading || shareLoading) && (
          <p className="loading-text">⏳ Processing...</p>
        )}
      </div>

      {/* Create new collage button */}
      <div className="share-footer">
        <button 
          className="btn btn-secondary btn-full"
          onClick={() => window.location.reload()}
        >
          Create Another Collage
        </button>
      </div>

      {/* Hidden canvas for rendering (same as preview) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}