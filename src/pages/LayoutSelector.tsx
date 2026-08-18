import type { Layout } from '../types/index';
import '../styles/LayoutSelector.css';

interface LayoutSelectorProps {
  photosCount: number;
  availableLayouts: Layout[];
  defaultLayout: Layout;
  onLayoutSelect: (layout: Layout) => void;
  onBack: () => void;
}

export default function LayoutSelector({
  photosCount,
  availableLayouts,
  defaultLayout,
  onLayoutSelect,
  onBack,
}: LayoutSelectorProps) {
  // Visual representation of layouts
  const layoutVisuals: Record<string, string> = {
    sideBySide: '[ ][ ]',
    stacked: '[  ]\n[  ]',
    '1big1small': '[    ][ ]',
    rowOf3: '[ ][ ][ ]',
    '1big2small': '[    ][  ]\n       [  ]',
    triangle: '[  ]   [  ]\n   [  ]',
    '2x2Grid': '[  ][  ]\n[  ][  ]',
    '1big3small': '[    ][  ]\n       [  ]\n       [  ]',
    '2top2bottom': '[  ][  ]\n[  ][  ]',
    '2x3Grid': '[  ][  ][  ]\n[  ][  ][  ]',
    masonry: '[    ][  ]\n       [  ]\n       [  ]',
    '3x2Grid': '[  ][  ][  ]\n[  ][  ][  ]',
  };

  return (
    <div className="layout-selector">
      <div className="layout-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2>Choose Layout</h2>
        <div className="spacer"></div>
      </div>

      <div className="layout-container">
        <p className="layout-subtitle">
          {photosCount} photo{photosCount !== 1 ? 's' : ''} — pick how to arrange them
        </p>

        <div className="layouts-grid">
          {availableLayouts.map((layout) => (
            <button
              key={layout.id}
              className={`layout-card ${
                layout.id === defaultLayout.id ? 'layout-card-recommended' : ''
              }`}
              onClick={() => onLayoutSelect(layout)}
            >
              {/* Layout visual representation */}
              <div className="layout-visual">
                <pre>{layoutVisuals[layout.id] || '🎨'}</pre>
              </div>

              {/* Layout name */}
              <h3>{layout.name}</h3>

              {/* Recommended badge */}
              {layout.id === defaultLayout.id && (
                <span className="recommended-badge">✓ Recommended</span>
              )}
            </button>
          ))}
        </div>

        <p className="layout-hint">
          💡 Layouts adjust automatically based on your photo count
        </p>
      </div>
    </div>
  );
}