import type { Theme } from '../data/themes';
import '../styles/ThemePicker.css';

interface ThemePickerProps {
  themes: Theme[];
  onThemeSelect: (themeId: string) => void;
  onBack: () => void;
}

export default function ThemePicker({
  themes,
  onThemeSelect,
  onBack,
}: ThemePickerProps) {
  // Emoji map for each theme
  const themeEmojis: Record<string, string> = {
    cottagecore: '🌿',
    '90s': '💿',
    analog: '📽️',
    coastal: '🐚',
    botanical: '🌿',
  };

  return (
    <div className="theme-picker">
      <div className="theme-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <h2>Pick a Vibe</h2>
        <div className="spacer"></div>
      </div>

      <div className="themes-container">
        <p className="theme-subtitle">Choose an aesthetic for your collage</p>

        <div className="themes-grid">
          {themes.map((theme) => (
            <button
              key={theme.id}
              className="theme-card"
              onClick={() => onThemeSelect(theme.id)}
              style={{
                backgroundColor: theme.backgroundColor,
                borderColor: theme.frameColor,
              }}
            >
              {/* Color preview boxes */}
              <div className="theme-preview">
                <div 
                  className="color-swatch"
                  style={{ backgroundColor: theme.backgroundColor }}
                />
                <div 
                  className="color-swatch"
                  style={{ backgroundColor: theme.frameColor }}
                />
                <div 
                  className="color-swatch"
                  style={{ backgroundColor: theme.photoBackgroundColor }}
                />
              </div>

              {/* Theme name and emoji */}
              <div className="theme-info">
                <span className="theme-emoji">{themeEmojis[theme.id] || '✨'}</span>
                <h3>{theme.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}