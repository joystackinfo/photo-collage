import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, CameraOff, Check, FolderOpen, Plus, Trash2 } from 'lucide-react';
import type { Photo } from '../types/index';
import '../styles/CameraUpload.css';

interface CameraUploadProps {
  onPhotosCapture: (photos: Photo[]) => void;
  onBack: () => void;
  photosCount: number;
}

export default function CameraUpload({ 
  onPhotosCapture, 
  onBack,
}: CameraUploadProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<Photo[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [captureMessage, setCaptureMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!cameraStream || !videoRef.current) return;

    videoRef.current.srcObject = cameraStream;
    videoRef.current.play().catch(() => {
      setCameraError('Camera preview could not start. Try clicking Start Camera again.');
    });

    return () => {
      cameraStream.getTracks().forEach((track) => track.stop());
    };
  }, [cameraStream]);

  // ====================
  // CAMERA FUNCTIONS
  // ====================

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // back camera on mobile
      });

      setCameraStream(stream);
      setIsCameraActive(true);
    } catch (error) {
      const message = error instanceof DOMException && error.name === 'NotAllowedError'
        ? 'Camera access was blocked. Allow camera access in your browser settings and try again.'
        : 'Could not access camera. Try uploading instead.';
      setCameraError(message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStream(null);
    setVideoReady(false);
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !videoReady) {
      setCameraError('The camera is still loading. Wait for the preview, then try again.');
      return;
    }

    const context = canvasRef.current.getContext('2d');
    if (!context) {
      setCameraError('Could not prepare the photo. Please try again.');
      return;
    }

    // Set canvas size to match the live video frame.
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0);

    canvasRef.current.toBlob((blob) => {
      if (!blob) {
        setCameraError('Could not capture the photo. Please try again.');
        return;
      }

      const photo: Photo = {
        id: Math.random().toString(36).substr(2, 9),
        data: blob,
        dataUrl: canvasRef.current!.toDataURL('image/jpeg'),
        brightness: 50,
        saturation: 50,
        edited: false,
      };

      setCapturedPhotos((currentPhotos) => [...currentPhotos, photo]);
      setCameraError(null);
      setCaptureMessage('Photo captured');
      window.setTimeout(() => setCaptureMessage(null), 2000);
    }, 'image/jpeg', 0.9);
  };

  // ====================
  // FILE UPLOAD
  // ====================

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedPhotos: Photo[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const photo: Photo = {
          id: Math.random().toString(36).substr(2, 9),
          data: file,
          dataUrl: event.target?.result as string,
          brightness: 50,
          saturation: 50,
          edited: false,
        };

        uploadedPhotos.push(photo);

        // Once all files are read, update state
        if (uploadedPhotos.length === files.length) {
          setCapturedPhotos([...capturedPhotos, ...uploadedPhotos]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  // ====================
  // PROCEED
  // ====================

  const handleContinue = () => {
    if (capturedPhotos.length > 0) {
      onPhotosCapture(capturedPhotos);
    }
  };

  // ====================
  // RENDER
  // ====================

  return (
    <div className="camera-upload">
      <div className="camera-header">
        <button className="btn-back" onClick={onBack} aria-label="Go back"><ArrowLeft size={18} aria-hidden="true" /> Back</button>
        <h2>Add Photos</h2>
        <div className="spacer"></div>
      </div>

      {/* Camera Section */}
      {!isCameraActive ? (
        <div className="camera-start">
          <button 
            className="btn btn-primary btn-large"
            onClick={startCamera}
          >
            <Camera size={22} aria-hidden="true" /> Start Camera
          </button>
          <p className="or-text">or</p>
          <button 
            className="btn btn-secondary btn-large"
            onClick={() => fileInputRef.current?.click()}
          >
            <FolderOpen size={22} aria-hidden="true" /> Choose Photos
          </button>
          <input 
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          {cameraError && <p className="error-text">{cameraError}</p>}
        </div>
      ) : (
        <div className="camera-active">
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            className="camera-feed"
          />
          <button 
            className="btn btn-primary btn-large capture-btn"
            onClick={capturePhoto}
            disabled={!videoReady}
          >
            {videoReady ? <><Camera size={22} aria-hidden="true" /> Capture</> : 'Camera loading...'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={stopCamera}
          >
            <CameraOff size={18} aria-hidden="true" /> Stop Camera
          </button>
        </div>
      )}

      {/* Canvas (hidden, for processing) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Photos Preview */}
      {capturedPhotos.length > 0 && (
        <div className="photos-preview">
          <h3>Photos Added: {capturedPhotos.length} / 6</h3>
          <div className="photos-grid">
            {capturedPhotos.map((photo, index) => (
              <div key={photo.id} className="photo-thumbnail">
                <img src={photo.dataUrl} alt={`Photo ${index + 1}`} />
                <button
                  className="remove-btn"
                  type="button"
                  title="Remove photo"
                  aria-label={`Remove photo ${index + 1}`}
                  onClick={() => {
                    setCapturedPhotos(capturedPhotos.filter((_, i) => i !== index));
                  }}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          {capturedPhotos.length < 6 && (
            <button 
              className="btn btn-secondary"
              onClick={() => setIsCameraActive(false)}
            >
              <Plus size={18} aria-hidden="true" /> Add More
            </button>
          )}
        </div>
      )}

      {/* Continue Button */}
      {capturedPhotos.length > 0 && (
        <button 
          className="btn btn-primary btn-continue"
          onClick={handleContinue}
        >
          Continue <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}
      {captureMessage && (
        <p className="action-feedback" role="status"><Check size={16} aria-hidden="true" /> {captureMessage}</p>
      )}
    </div>
  );
}