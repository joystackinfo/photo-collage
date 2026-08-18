export interface Sticker {
  type: string;
  position: { x: number; y: number }; // percentage
  size: number; // pixels
  opacity: number; // 0-1
  svgCode: string;
}

export interface Theme {
  id: 'cottagecore' | '90s' | 'analog' | 'coastal' | 'botanical';
  name: string;
  backgroundColor: string;
  frameColor: string;
  frameBorderWidth: 2 | 4 | 6;
  cornerRadius: 0 | 4 | 12;
  stickers: Sticker[];
  photoBackgroundColor: string;
}

export const themes: Theme[] = [
  {
    id: 'cottagecore',
    name: 'Cottagecore',
    backgroundColor: '#d4a574',
    frameColor: '#8b6f47',
    frameBorderWidth: 4,
    cornerRadius: 4,
    photoBackgroundColor: '#fef5e7',
    stickers: [
      // Top-left vines
      {
        type: 'vine',
        position: { x: 5, y: 8 },
        size: 40,
        opacity: 0.7,
        svgCode: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 35 Q10 30 15 25 Q18 22 20 18" fill="none" stroke="#a68560" stroke-width="2" stroke-linecap="round"/>
          <circle cx="8" cy="32" r="2" fill="#a68560" opacity="0.8"/>
          <circle cx="13" cy="26" r="1.5" fill="#8b6f47"/>
        </svg>`,
      },
      // Top-right leaf
      {
        type: 'leaf',
        position: { x: 90, y: 10 },
        size: 35,
        opacity: 0.6,
        svgCode: `<svg viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 5 Q25 12 20 25 Q15 20 17 5" fill="#8b6f47" opacity="0.7"/>
          <path d="M17 5 Q17 15 17 25" stroke="#6b4f2a" stroke-width="1" opacity="0.5"/>
        </svg>`,
      },
      // Bottom-left flower
      {
        type: 'flower',
        position: { x: 8, y: 88 },
        size: 30,
        opacity: 0.5,
        svgCode: `<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="15" cy="15" r="3" fill="#a68560"/>
          <circle cx="15" cy="5" r="2.5" fill="#8b6f47" opacity="0.7"/>
          <circle cx="25" cy="15" r="2.5" fill="#8b6f47" opacity="0.7"/>
          <circle cx="15" cy="25" r="2.5" fill="#8b6f47" opacity="0.7"/>
          <circle cx="5" cy="15" r="2.5" fill="#8b6f47" opacity="0.7"/>
        </svg>`,
      },
      // Bottom-right botanical elements
      {
        type: 'botanical',
        position: { x: 88, y: 85 },
        size: 38,
        opacity: 0.6,
        svgCode: `<svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 30 Q8 25 10 20 Q12 15 15 10" fill="none" stroke="#8b6f47" stroke-width="1.5" opacity="0.7" stroke-linecap="round"/>
          <path d="M20 28 Q22 22 25 16" fill="none" stroke="#a68560" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
          <ellipse cx="12" cy="18" rx="2" ry="3" fill="#6b4f2a" opacity="0.5"/>
        </svg>`,
      },
    ],
  },
  {
    id: '90s',
    name: '90s',
    backgroundColor: '#7a9cc8',
    frameColor: '#2a5a7a',
    frameBorderWidth: 4,
    cornerRadius: 4,
    photoBackgroundColor: '#e8e8e8',
    stickers: [
      // Top-left CD
      {
        type: 'cd',
        position: { x: 8, y: 10 },
        size: 32,
        opacity: 0.7,
        svgCode: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="none" stroke="#2a5a7a" stroke-width="1.5" opacity="0.7"/>
          <circle cx="16" cy="16" r="10" fill="none" stroke="#2a5a7a" stroke-width="1" opacity="0.6"/>
          <circle cx="16" cy="16" r="6" fill="none" stroke="#5a7aa8" stroke-width="1" opacity="0.5"/>
          <circle cx="16" cy="16" r="2" fill="#2a5a7a" opacity="0.8"/>
        </svg>`,
      },
      // Top-right pixels
      {
        type: 'pixel',
        position: { x: 88, y: 12 },
        size: 28,
        opacity: 0.6,
        svgCode: `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="5" height="5" fill="#2a5a7a" opacity="0.7"/>
          <rect x="12" y="4" width="5" height="5" fill="#5a7aa8" opacity="0.6"/>
          <rect x="4" y="12" width="5" height="5" fill="#5a7aa8" opacity="0.6"/>
          <rect x="12" y="12" width="5" height="5" fill="#2a5a7a" opacity="0.7"/>
          <rect x="8" y="20" width="5" height="5" fill="#2a5a7a" opacity="0.5"/>
        </svg>`,
      },
      // Bottom-left beeper
      {
        type: 'beeper',
        position: { x: 10, y: 85 },
        size: 30,
        opacity: 0.5,
        svgCode: `<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="8" width="20" height="15" rx="2" fill="none" stroke="#2a5a7a" stroke-width="1.5" opacity="0.7"/>
          <rect x="8" y="11" width="14" height="6" fill="#5a7aa8" opacity="0.6"/>
          <circle cx="15" cy="23" r="1.5" fill="#2a5a7a" opacity="0.6"/>
        </svg>`,
      },
      // Bottom-right wave
      {
        type: 'wave',
        position: { x: 85, y: 88 },
        size: 32,
        opacity: 0.5,
        svgCode: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 20 Q8 15 14 20 T26 20" fill="none" stroke="#2a5a7a" stroke-width="1.5" opacity="0.7" stroke-linecap="round"/>
          <path d="M2 24 Q8 19 14 24 T26 24" fill="none" stroke="#5a7aa8" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
        </svg>`,
      },
    ],
  },
  {
    id: 'analog',
    name: 'Analog',
    backgroundColor: '#2a2a2a',
    frameColor: '#000000',
    frameBorderWidth: 4,
    cornerRadius: 0,
    photoBackgroundColor: '#ffffff',
    stickers: [
      // Top-left perforation hole
      {
        type: 'perforation',
        position: { x: 8, y: -2 },
        size: 8,
        opacity: 0.6,
        svgCode: `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="3" fill="white" opacity="0.6"/>
        </svg>`,
      },
      // Film strip top-right
      {
        type: 'filmstrip',
        position: { x: 88, y: -2 },
        size: 8,
        opacity: 0.6,
        svgCode: `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="3" fill="white" opacity="0.6"/>
        </svg>`,
      },
      // Bottom-left camera icon
      {
        type: 'camera',
        position: { x: 10, y: 92 },
        size: 28,
        opacity: 0.4,
        svgCode: `<svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="8" width="20" height="14" rx="2" fill="none" stroke="white" stroke-width="1" opacity="0.5"/>
          <circle cx="14" cy="15" r="5" fill="none" stroke="white" stroke-width="1" opacity="0.4"/>
          <circle cx="20" cy="10" r="1.5" fill="white" opacity="0.4"/>
        </svg>`,
      },
      // Bottom-right perforation
      {
        type: 'perforation',
        position: { x: 90, y: 92 },
        size: 8,
        opacity: 0.6,
        svgCode: `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
          <circle cx="4" cy="4" r="3" fill="white" opacity="0.6"/>
        </svg>`,
      },
    ],
  },
  {
    id: 'coastal',
    name: 'Coastal',
    backgroundColor: '#b3d9e8',
    frameColor: '#1a5f7a',
    frameBorderWidth: 4,
    cornerRadius: 12,
    photoBackgroundColor: '#ffffff',
    stickers: [
      // Top-left shell
      {
        type: 'shell',
        position: { x: 8, y: 10 },
        size: 34,
        opacity: 0.8,
        svgCode: `<svg viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 5 Q12 10 10 18 Q12 22 17 24 Q22 22 24 18 Q22 10 17 5" fill="#c97a5c" opacity="0.8"/>
          <path d="M14 12 Q17 10 20 12" fill="none" stroke="#a67050" stroke-width="1" opacity="0.6"/>
          <path d="M13 16 Q17 15 21 16" fill="none" stroke="#a67050" stroke-width="1" opacity="0.6"/>
        </svg>`,
      },
      // Top-right starfish
      {
        type: 'starfish',
        position: { x: 86, y: 12 },
        size: 32,
        opacity: 0.7,
        svgCode: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2 L20 12 L30 16 L20 20 L16 30 L12 20 L2 16 L12 12 Z" fill="#4da6a6" opacity="0.7"/>
          <circle cx="16" cy="16" r="4" fill="#1a5f7a" opacity="0.6"/>
        </svg>`,
      },
      // Bottom-left wave
      {
        type: 'wave',
        position: { x: 12, y: 86 },
        size: 30,
        opacity: 0.6,
        svgCode: `<svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 18 Q6 14 10 18 T18 18 T26 18" fill="none" stroke="#1a5f7a" stroke-width="1.5" opacity="0.6" stroke-linecap="round"/>
          <path d="M2 24 Q6 20 10 24 T18 24 T26 24" fill="none" stroke="#007a7e" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
        </svg>`,
      },
      // Bottom-right sand dollar
      {
        type: 'sanddollar',
        position: { x: 84, y: 88 },
        size: 32,
        opacity: 0.5,
        svgCode: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="none" stroke="#c97a5c" stroke-width="1.5" opacity="0.6"/>
          <path d="M16 6 L18 12 L16 14 L14 12 Z" fill="#c97a5c" opacity="0.5"/>
          <path d="M26 16 L20 18 L18 16 L20 14 Z" fill="#c97a5c" opacity="0.5"/>
          <path d="M16 26 L14 20 L16 18 L18 20 Z" fill="#c97a5c" opacity="0.5"/>
          <path d="M6 16 L12 14 L14 16 L12 18 Z" fill="#c97a5c" opacity="0.5"/>
        </svg>`,
      },
    ],
  },
  {
    id: 'botanical',
    name: 'Botanical',
    backgroundColor: '#c8e6c9',
    frameColor: '#388e3c',
    frameBorderWidth: 4,
    cornerRadius: 12,
    photoBackgroundColor: '#f1f8f6',
    stickers: [
      // Top-left monstera leaf
      {
        type: 'monstera',
        position: { x: 6, y: 12 },
        size: 40,
        opacity: 0.7,
        svgCode: `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 5 Q30 10 32 20 Q30 30 20 35 Q10 30 8 20 Q10 10 20 5" fill="#7cb342" opacity="0.7"/>
          <path d="M20 5 Q20 15 20 35" stroke="#558b2f" stroke-width="1" opacity="0.6"/>
          <circle cx="25" cy="18" r="2" fill="white" opacity="0.4"/>
          <circle cx="15" cy="22" r="2" fill="white" opacity="0.4"/>
          <circle cx="22" cy="28" r="1.5" fill="white" opacity="0.3"/>
        </svg>`,
      },
      // Top-right fern
      {
        type: 'fern',
        position: { x: 88, y: 10 },
        size: 36,
        opacity: 0.6,
        svgCode: `<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 5 L18 30" stroke="#558b2f" stroke-width="1.5" opacity="0.7"/>
          <path d="M18 8 L14 10 M18 8 L22 10" stroke="#7cb342" stroke-width="1" opacity="0.6"/>
          <path d="M18 14 L12 16 M18 14 L24 16" stroke="#7cb342" stroke-width="1" opacity="0.6"/>
          <path d="M18 20 L13 22 M18 20 L23 22" stroke="#7cb342" stroke-width="1" opacity="0.6"/>
          <path d="M18 26 L14 27 M18 26 L22 27" stroke="#7cb342" stroke-width="1" opacity="0.5"/>
        </svg>`,
      },
      // Bottom-left vine
      {
        type: 'vine',
        position: { x: 8, y: 86 },
        size: 35,
        opacity: 0.6,
        svgCode: `<svg viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 30 Q8 25 12 20 Q15 15 18 10" fill="none" stroke="#558b2f" stroke-width="1.5" opacity="0.7" stroke-linecap="round"/>
          <circle cx="10" cy="24" r="1.5" fill="#7cb342" opacity="0.6"/>
          <circle cx="15" cy="16" r="1.5" fill="#7cb342" opacity="0.6"/>
          <circle cx="17" cy="11" r="1" fill="#7cb342" opacity="0.5"/>
        </svg>`,
      },
      // Bottom-right botanical scatter
      {
        type: 'botanical-scatter',
        position: { x: 85, y: 88 },
        size: 38,
        opacity: 0.5,
        svgCode: `<svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 30 Q10 25 15 20" fill="none" stroke="#558b2f" stroke-width="1" opacity="0.6" stroke-linecap="round"/>
          <path d="M28 32 Q25 28 22 24" fill="none" stroke="#7cb342" stroke-width="1" opacity="0.5" stroke-linecap="round"/>
          <ellipse cx="12" cy="26" rx="2" ry="3" fill="#7cb342" opacity="0.5"/>
          <ellipse cx="20" cy="20" rx="2" ry="3" fill="#558b2f" opacity="0.5"/>
        </svg>`,
      },
    ],
  },
];

export const getTheme = (themeId: Theme['id']): Theme | undefined => {
  return themes.find((theme) => theme.id === themeId);
};