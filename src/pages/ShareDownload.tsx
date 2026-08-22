import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Clipboard, Download, Link, LoaderCircle, RefreshCcw } from 'lucide-react';
import type { Photo, Layout, Mode } from '../types/index';
import type { Theme } from '../data/themes';
import { applyImageAdjustments } from '../utils/imageProcessor';
import { createShareLink } from '../utils/shareService';
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
  photos,
  theme,
  layout,
  isLoading,
  onBack,
}: ShareDownloadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  // Render the collage onto our hidden canvas the same way CanvasPreview does.
  // We need this because this component has its own <canvas>, separate from
  // the one shown in the preview screen — so it starts out blank.
  useEffect(() => {
    renderCollage();
  }, [photos, theme, layout]);

  const renderCollage = async () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = 400;
    const canvasHeight = 500;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Background
    ctx.fillStyle = theme.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Photos
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const position = layout.positions[i];
      if (!position) continue;

      const x = (position.x / 100) * canvasWidth;
      const y = (position.y / 100) * canvasHeight;
      const width = (position.width / 100) * canvasWidth;
      const height = (position.height / 100) * canvasHeight;

      const img = await blobToImage(photo.data);

      ctx.fillStyle = theme.photoBackgroundColor;
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, x, y, width, height, theme.cornerRadius);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      roundRect(ctx, x + 2, y + 2, width - 4, height - 4, theme.cornerRadius);
      ctx.clip();
      ctx.drawImage(img, x + 2, y + 2, width - 4, height - 4);
      applyImageAdjustments(ctx, x + 2, y + 2, width - 4, height - 4, photo.brightness, photo.saturation);
      ctx.restore();

      ctx.strokeStyle = theme.frameColor;
      ctx.lineWidth = theme.frameBorderWidth;
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, x, y, width, height, theme.cornerRadius);
      ctx.stroke();
      ctx.restore();
    }

    // Stickers
    theme.stickers.forEach((sticker) => {
      const x = (sticker.position.x / 100) * canvasWidth;
      const y = (sticker.position.y / 100) * canvasHeight;

      const svgBlob = new Blob([sticker.svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      const stickerImg = new Image();
      stickerImg.onload = () => {
        ctx.save();
        ctx.globalAlpha = sticker.opacity;
        ctx.drawImage(stickerImg, x - sticker.size / 2, y - sticker.size / 2, sticker.size, sticker.size);
        ctx.restore();
        URL.revokeObjectURL(url);
      };
      stickerImg.src = url;
    });
  };

  const blobToImage = (blob: Blob): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): void => {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  };

  // ====================
  // DOWNLOAD
  // ====================

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setDownloadLoading(true);
    setDownloaded(false);

    canvasRef.current.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `collage-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2500);
      setDownloadLoading(false);
    }, 'image/png');
  };

  // ====================
  // SHARE (via Supabase)
  // ====================

  const handleShare = async () => {
    if (!canvasRef.current) return;

    setShareLoading(true);
    setShareError(null);

    try {
      // Convert canvas to a real image blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvasRef.current!.toBlob((b) => resolve(b), 'image/png');
      });

      if (!blob) {
        throw new Error('Could not create image from canvas.');
      }

      // Upload to Supabase + save the share link record
      const link = await createShareLink(blob);
      setShareLink(link);
    } catch (error) {
      console.error('Share failed:', error);
      setShareError('Could not create share link. Try downloading instead.');
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
        <button className="btn-back" onClick={onBack} aria-label="Go back"><ArrowLeft size={18} aria-hidden="true" /> Back</button>
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
                {copied ? <><Check size={17} aria-hidden="true" /> Copied</> : <><Clipboard size={17} aria-hidden="true" /> Copy Link</>}
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
              disabled={isLoading || downloadLoading}
            >
              {downloadLoading ? <><LoaderCircle className="spin" size={18} aria-hidden="true" /> Saving...</> : <><Download size={18} aria-hidden="true" /> Download</>}
            </button>

            <p className="or-text">or</p>

            <button 
              className="btn btn-secondary btn-large"
              onClick={handleShare}
              disabled={shareLoading || isLoading}
            >
              {shareLoading ? <><LoaderCircle className="spin" size={18} aria-hidden="true" /> Creating...</> : <><Link size={18} aria-hidden="true" /> Share Link</>}
            </button>
          </div>
        )}

        {/* Loading state */}
        {(isLoading || shareLoading || downloadLoading) && (
          <p className="loading-text" role="status">Processing...</p>
        )}
        {downloaded && <p className="action-feedback" role="status"><Check size={16} aria-hidden="true" /> Saved</p>}
        {shareError && <p className="error-text" role="alert">{shareError}</p>}
      </div>

      {/* Create new collage button */}
      <div className="share-footer">
        <button 
          className="btn btn-secondary btn-full"
          onClick={() => window.location.reload()}
        >
          <RefreshCcw size={17} aria-hidden="true" /> New Collage
        </button>
      </div>

      {/* Canvas that actually gets downloaded/shared — kept hidden, but now rendered */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}