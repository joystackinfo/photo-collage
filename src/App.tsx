import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import type { Photo, Mode, Layout } from './types/index';
import { themes, getTheme } from './data/themes';
import { getDefaultLayout, getLayoutsForPhotoCount } from './utils/layoutCalculator';
import LandingPage from './pages/LandingPage';
// CameraUpload may be provided as a JavaScript page without TypeScript declarations.
// @ts-ignore -- the page is resolved by the bundler at runtime.
import CameraUpload from './pages/CameraUpload';
import ModeSelector from './pages/ModeSelector';
import ThemePicker from './pages/Themepicker';
import PhotoEditor from './pages/PhotoEditor';
import LayoutSelector from './pages/LayoutSelector';
import CanvasPreview from './pages/CanvasPreview';
import ShareDownload from './pages/ShareDownload';
import SharedView from './pages/SharedView';
import './App.css';

type AppStep = 
  | 'landing' 
  | 'camera' 
  | 'mode' 
  | 'theme' 
  | 'editor' 
  | 'layout' 
  | 'preview' 
  | 'share';

function CollageFlow() {
  // Current step in the flow
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');

  // Photos user has taken/uploaded
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Which photo is being edited right now
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);

  // Selected theme
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

  // Single or collage mode
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  // Selected layout for collage
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);

  // Loading state (for uploads)
  const [isLoading] = useState(false);

  // Error message
  const [error, setError] = useState<string | null>(null);

  // ====================
  // HANDLERS
  // ====================

  // When user takes/uploads a photo
  const handlePhotoCapture = (newPhotos: Photo[]) => {
    setPhotos([...photos, ...newPhotos]);
    setCurrentPhotoIndex(photos.length); // Focus on newly added photo
    
    // If they have photos, ask for mode (single or collage)
    if (photos.length + newPhotos.length > 0) {
      setCurrentStep('mode');
    }
  };

  // When user adds more photos
  const handleAddMorePhotos = () => {
    setCurrentStep('camera');
  };

  // When user picks single or collage mode
  const handleModeSelect = (mode: Mode) => {
    setSelectedMode(mode);
    setCurrentStep('theme');
  };

  // When user picks a theme
  const handleThemeSelect = (themeId: string) => {
    setSelectedThemeId(themeId);
    
    // If single photo mode, go to preview
    // If collage, ask for layout
    if (selectedMode === 'single') {
      setCurrentStep('preview');
    } else {
      setCurrentStep('layout');
    }
  };

  // When user picks a layout (collage mode only)
  const handleLayoutSelect = (layout: Layout) => {
    setSelectedLayout(layout);
    setCurrentStep('preview');
  };

  // When user adjusts brightness/saturation
  const handlePhotoAdjustment = (brightness: number, saturation: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos[currentPhotoIndex] = {
      ...updatedPhotos[currentPhotoIndex],
      brightness,
      saturation,
      edited: true,
    };
    setPhotos(updatedPhotos);
  };

  const handlePhotoCrop = (cropZoom: number, cropX: number, cropY: number) => {
    const updatedPhotos = [...photos];
    updatedPhotos[currentPhotoIndex] = {
      ...updatedPhotos[currentPhotoIndex],
      cropZoom,
      cropX,
      cropY,
      edited: true,
    };
    setPhotos(updatedPhotos);
  };

  // When user clicks "Next" from editor
  const handleEditorNext = () => {
    // If more photos to edit, stay in editor
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    } else {
      // All photos edited, go to layout or preview
      if (selectedMode === 'single') {
        setCurrentStep('preview');
      } else {
        setCurrentStep('layout');
      }
    }
  };

  // When user goes back
  const handleGoBack = () => {
    // Simple back navigation based on current step
    const backMap: Record<AppStep, AppStep> = {
      landing: 'landing',
      camera: 'landing',
      mode: 'camera',
      theme: 'mode',
      editor: 'theme',
      layout: 'theme',
      preview: selectedMode === 'single' ? 'editor' : 'layout',
      share: 'preview',
    };
    setCurrentStep(backMap[currentStep]);
  };

  // ====================
  // RENDER CURRENT STEP
  // ====================

  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {currentStep === 'landing' && (
        <LandingPage 
          onGetStarted={() => setCurrentStep('camera')}
        />
      )}

      {currentStep === 'camera' && (
        <CameraUpload 
          onPhotosCapture={handlePhotoCapture}
          onBack={handleGoBack}
          photosCount={photos.length}
        />
      )}

      {currentStep === 'mode' && (
        <ModeSelector 
          onModeSelect={handleModeSelect}
          onAddMore={handleAddMorePhotos}
          photosCount={photos.length}
          onBack={handleGoBack}
        />
      )}

      {currentStep === 'theme' && (
        <ThemePicker 
          themes={themes}
          onThemeSelect={handleThemeSelect}
          onBack={handleGoBack}
        />
      )}

      {currentStep === 'editor' && (
        <PhotoEditor 
          photo={photos[currentPhotoIndex]}
          photoIndex={currentPhotoIndex}
          totalPhotos={photos.length}
          onAdjustment={handlePhotoAdjustment}
          onCrop={handlePhotoCrop}
          onNext={handleEditorNext}
          onBack={handleGoBack}
        />
      )}

      {currentStep === 'layout' && selectedMode === 'collage' && (
        <LayoutSelector 
          photosCount={photos.length}
          availableLayouts={getLayoutsForPhotoCount(photos.length)}
          defaultLayout={getDefaultLayout(photos.length)}
          onLayoutSelect={handleLayoutSelect}
          onBack={handleGoBack}
        />
      )}

      {currentStep === 'preview' && selectedThemeId && (
        <CanvasPreview 
          photos={photos}
          theme={getTheme(selectedThemeId as any)!}
          layout={selectedLayout || getDefaultLayout(photos.length)}
          mode={selectedMode!}
          onEditPhoto={() => setCurrentStep('editor')}
          onNext={() => setCurrentStep('share')}
          onBack={handleGoBack}
        />
      )}

      {currentStep === 'share' && selectedThemeId && (
        <ShareDownload 
          photos={photos}
          theme={getTheme(selectedThemeId as any)!}
          layout={selectedLayout || getDefaultLayout(photos.length)}
          mode={selectedMode!}
          isLoading={isLoading}
          onBack={handleGoBack}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* The whole "create a collage" flow lives at the home route */}
      <Route path="/" element={<CollageFlow />} />

      {/* Someone opening a shared link lands here instead */}
      <Route path="/share/:id" element={<SharedView />} />
    </Routes>
  );
}

export default App;