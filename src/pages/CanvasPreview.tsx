import { useEffect, useRef, useState } from 'react';
import type { Photo, Layout, Mode } from '../types/index';
import type { Theme } from '../data/themes';
import { applyImageAdjustments } from '../utils/imageProcessor';
import '../styles/CanvasPreview.css';

interface CanvasPreviewProps {
  photos: Photo[];
  theme: Theme;
  layout: Layout;
  mode: Mode;
  onEditPhoto: () => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CanvasPreview({
  photos,
  theme,
  layout,
  mode,
  onEditPhoto,
  onNext,
  onBack,
}: CanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(true);

  // Render collage on canvas
  useEffect(() => {
    setIsRendering(true);
    renderCollage();
    setIsRendering(false);
  }, [photos, theme, layout, mode]);

  const renderCollage = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions (aspect ratio 4:5 for mobile, Instagram-friendly)
    const canvasWidth = 400;
    const canvasHeight = 500;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 1. Draw background color
    ctx.fillStyle = theme.backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 2. Draw photos with frame and adjustments
    await drawPhotos(ctx, canvasWidth, canvasHeight);

    // 3. Draw stickers
    drawStickers(ctx, canvasWidth, canvasHeight);
  };

  const drawPhotos = async (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ): Promise<void> => {
    // For each photo in layout
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const position = layout.positions[i];

      if (!position) continue;

      // Convert percentages to pixels
      const x = (position.x / 100) * canvasWidth;
      const y = (position.y / 100) * canvasHeight;
      const width = (position.width / 100) * canvasWidth;
      const height = (position.height / 100) * canvasHeight;

      // Create image from blob
      const img = await blobToImage(photo.data);

      // Draw frame background (photo background color)
      ctx.fillStyle = theme.photoBackgroundColor;
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, x, y, width, height, theme.cornerRadius);
      ctx.fill();
      ctx.restore();

      // Draw photo with adjustments
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, x + 2, y + 2, width - 4, height - 4, theme.cornerRadius);
      ctx.clip();

      // Draw image (fills the clipped area)
      ctx.drawImage(img, x + 2, y + 2, width - 4, height - 4);

      // Apply brightness/saturation adjustments to this region
      applyImageAdjustments(
        ctx,
        x + 2,
        y + 2,
        width - 4,
        height - 4,
        photo.brightness,
        photo.saturation
      );

      ctx.restore();

      // Draw frame border
      ctx.strokeStyle = theme.frameColor;
      ctx.lineWidth = theme.frameBorderWidth;
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, x, y, width, height, theme.cornerRadius);
      ctx.stroke();
      ctx.restore();
    }
  };

  const drawStickers = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number
  ): void => {
    // Draw each sticker from theme
    theme.stickers.forEach((sticker) => {
      const x = (sticker.position.x / 100) * canvasWidth;
      const y = (sticker.position.y / 100) * canvasHeight;

      ctx.save();
      ctx.globalAlpha = sticker.opacity;

      // Create SVG image from sticker code
      const svgBlob = new Blob([sticker.svgCode], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(svgBlob);
      const stickerImg = new Image();

      stickerImg.onload = () => {
        ctx.drawImage(stickerImg, x - sticker.size / 2, y - sticker.size / 2, sticker.size, sticker.size);
        URL.revokeObjectURL(url);
      };

      stickerImg.src = url;
      ctx.restore();
    });
  };

  // Helper: convert blob to image
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

  // Helper: draw rounded rectangle
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

  return (
    <div className="canvas-preview">
      <div className="preview-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2>Preview</h2>
        <div className="spacer"></div>
      </div>

      <div className="preview-container">
        {isRendering && <p className="rendering-text">Rendering...</p>}
        
        <div className="canvas-wrapper">
          <canvas ref={canvasRef} className="preview-canvas" />
        </div>

        <div className="preview-actions">
          <button 
            className="btn btn-secondary"
            onClick={onEditPhoto}
          >
            ✏️ Edit Photo
          </button>
        </div>
      </div>

      <div className="preview-footer">
        <button 
          className="btn btn-primary btn-full"
          onClick={onNext}
        >
          Share or Download →
        </button>
      </div>
    </div>
  );
}