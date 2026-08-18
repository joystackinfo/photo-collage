import type { Mode } from '../types/index';
import '../styles/ModeSelector.css';

interface ModeSelectorProps {
  onModeSelect: (mode: Mode) => void;
  onAddMore: () => void;
  photosCount: number;
  onBack: () => void;
}

export default function ModeSelector({
  onModeSelect,
  onAddMore,
  photosCount,
  onBack,
}: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      <div className="mode-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2>Choose Mode</h2>
        <div className="spacer"></div>
      </div>

      <div className="mode-container">
        <p className="mode-subtitle">You have {photosCount} photo{photosCount !== 1 ? 's' : ''}</p>

        {/* Single Frame Mode */}
        <button 
          className="mode-card"
          onClick={() => onModeSelect('single')}
        >
          <div className="mode-icon">🖼️</div>
          <h3>Single Frame</h3>
          <p>One photo with a custom frame</p>
        </button>

        {/* Collage Mode (only if 2+ photos) */}
        {photosCount >= 2 && (
          <button 
            className="mode-card"
            onClick={() => onModeSelect('collage')}
          >
            <div className="mode-icon">🎨</div>
            <h3>Collage</h3>
            <p>Multiple photos arranged together</p>
          </button>
        )}

        {/* Add More Photos Option */}
        {photosCount < 6 && (
          <button 
            className="mode-card mode-card-secondary"
            onClick={onAddMore}
          >
            <div className="mode-icon">➕</div>
            <h3>Add More Photos</h3>
            <p>Add up to {6 - photosCount} more</p>
          </button>
        )}
      </div>

      {photosCount === 1 && (
        <p className="mode-hint">
          💡 Tip: Add more photos to create a collage!
        </p>
      )}
    </div>
  );
}