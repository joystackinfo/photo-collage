import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Crop, RotateCcw } from 'lucide-react';
import  type { Photo } from '../types/index';
import '../styles/PhotoEditor.css';

interface PhotoEditorProps {
  photo: Photo;
  photoIndex: number;
  totalPhotos: number;
  onAdjustment: (brightness: number, saturation: number) => void;
  onCrop: (cropZoom: number, cropX: number, cropY: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PhotoEditor({
  photo,
  photoIndex,
  totalPhotos,
  onAdjustment,
  onCrop,
  onNext,
  onBack,
}: PhotoEditorProps) {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [brightness, setBrightness] = useState(photo.brightness);
  const [saturation, setSaturation] = useState(photo.saturation);
  const [cropZoom, setCropZoom] = useState(photo.cropZoom ?? 1);
  const [cropX, setCropX] = useState(photo.cropX ?? 0);
  const [cropY, setCropY] = useState(photo.cropY ?? 0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load image and update preview
  useEffect(() => {
    const img = new Image();
    img.src = photo.dataUrl;
    
    img.onload = () => {
      updatePreview(img, brightness, saturation);
      setImageLoaded(true);
    };
  }, [photo.dataUrl]);

  // Update preview when sliders change
  useEffect(() => {
    if (imageLoaded) {
      const img = new Image();
      img.src = photo.dataUrl;
      img.onload = () => updatePreview(img, brightness, saturation);
    }
  }, [brightness, saturation, imageLoaded, photo.dataUrl]);

  const updatePreview = (img: HTMLImageElement, _bright: number, _sat: number) => {
    if (!previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw image
    ctx.drawImage(img, 0, 0);

    // Import the adjustment function dynamically to apply it
    // For now, we'll draw the image and apply CSS filters as preview
    // (Full pixel-by-pixel adjustment will happen in final render)
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    onAdjustment(value, saturation);
  };

  const handleSaturationChange = (value: number) => {
    setSaturation(value);
    onAdjustment(brightness, value);
  };

  return (
    <div className="photo-editor">
      <div className="editor-header">
        <button className="btn-back" onClick={onBack} aria-label="Go back"><ArrowLeft size={18} aria-hidden="true" /> Back</button>
        <h2>Adjust Photo</h2>
        <span className="photo-counter">{photoIndex + 1} / {totalPhotos}</span>
      </div>

      <div className="editor-container">
        {/* Preview */}
        <div className="preview-section">
          <div className="preview-wrapper">
            <img
              src={photo.dataUrl}
              alt="Preview"
              className="preview-image"
              style={{
                filter: `brightness(${brightness / 50}) saturate(${saturation / 50})`,
                transform: `scale(${cropZoom})`,
                objectPosition: `${50 + cropX}% ${50 + cropY}%`,
              }}
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="sliders-section">
          <div className="crop-heading">
            <h3><Crop size={18} aria-hidden="true" /> Crop and position</h3>
            <span className="slider-value">{Math.round(cropZoom * 100)}%</span>
          </div>

          <div className="slider-group">
            <div className="slider-label">
              <label htmlFor="crop-zoom">Zoom</label>
              <span className="slider-value">{Math.round(cropZoom * 100)}%</span>
            </div>
            <input
              id="crop-zoom"
              type="range"
              min="1"
              max="2"
              step="0.01"
              value={cropZoom}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCropZoom(value);
                onCrop(value, cropX, cropY);
              }}
              className="slider"
            />
          </div>

          <div className="slider-group">
            <div className="slider-label">
              <label htmlFor="crop-x">Horizontal</label>
              <span className="slider-value">{cropX}</span>
            </div>
            <input
              id="crop-x"
              type="range"
              min="-50"
              max="50"
              value={cropX}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCropX(value);
                onCrop(cropZoom, value, cropY);
              }}
              className="slider"
            />
          </div>

          <div className="slider-group">
            <div className="slider-label">
              <label htmlFor="crop-y">Vertical</label>
              <span className="slider-value">{cropY}</span>
            </div>
            <input
              id="crop-y"
              type="range"
              min="-50"
              max="50"
              value={cropY}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCropY(value);
                onCrop(cropZoom, cropX, value);
              }}
              className="slider"
            />
          </div>

          {/* Brightness Slider */}
          <div className="slider-group">
            <div className="slider-label">
              <label>Brightness</label>
              <span className="slider-value">{brightness}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={brightness}
              onChange={(e) => handleBrightnessChange(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-marks">
              <span>Darker</span>
              <span>Default</span>
              <span>Brighter</span>
            </div>
          </div>

          {/* Saturation Slider */}
          <div className="slider-group">
            <div className="slider-label">
              <label>Saturation</label>
              <span className="slider-value">{saturation}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => handleSaturationChange(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-marks">
              <span>Less Color</span>
              <span>Default</span>
              <span>More Color</span>
            </div>
          </div>

          {/* Reset Button */}
          <button
            className="btn btn-secondary"
            onClick={() => {
              setBrightness(50);
              setSaturation(50);
              setCropZoom(1);
              setCropX(0);
              setCropY(0);
              onAdjustment(50, 50);
              onCrop(1, 0, 0);
            }}
          >
            <RotateCcw size={17} aria-hidden="true" /> Reset
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="editor-actions">
        <button
          className="btn btn-primary btn-full"
          onClick={onNext}
        >
          {photoIndex < totalPhotos - 1 ? <>Next <ArrowRight size={18} aria-hidden="true" /></> : <>Done <Check size={18} aria-hidden="true" /></>}
        </button>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}