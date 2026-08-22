// Photo type: represents a single photo the user took/uploaded
export interface Photo {
  id: string; // unique identifier for this photo
  data: Blob; // the actual image data (camera feed or uploaded file)
  dataUrl: string; // base64 string for preview (shows in UI)
  brightness: number; // 0-100, default 50
  saturation: number; // 0-100, default 50
  cropZoom?: number; // 1-2, default 1
  cropX?: number; // -50 to 50, default 0
  cropY?: number; // -50 to 50, default 0
  edited: boolean; // whether user adjusted it
}

// Adjustment type: brightness/saturation settings
export interface Adjustments {
  brightness: number; // 0-100
  saturation: number; // 0-100
}

// Layout position: where a photo sits in the canvas
export interface LayoutPosition {
  x: number; // x coordinate as percentage (0-100)
  y: number; // y coordinate as percentage (0-100)
  width: number; // width as percentage (0-100)
  height: number; // height as percentage (0-100)
}

// Layout: how photos are arranged
export interface Layout {
  id: string; // 'sideBySide', '2x2Grid', 'masonry', etc
  name: string; // 'Side-by-side', '2x2 Grid', etc
  positions: LayoutPosition[]; // array of positions for each photo
}

// Mode: what user is creating
export type Mode = 'single' | 'collage';

// Collage: the complete collage/frame object
export interface Collage {
  id: string; // unique id for this collage
  photos: Photo[]; // array of photos in this collage
  themeId: 'cottagecore' | '90s' | 'analog' | 'coastal' | 'botanical'; // which theme
  layout: Layout; // how photos are arranged
  mode: Mode; // 'single' or 'collage'
  createdAt: Date; // when it was created
  canvasWidth: number; // final canvas dimensions
  canvasHeight: number; // final canvas dimensions
}

// ShareLink: a shareable link to a collage
export interface ShareLink {
  id: string; // unique slug (abc123xyz)
  collageId: string; // which collage this links to
  imageUrl: string; // URL to image in Supabase Storage
  createdAt: Date; // when the link was created
  expiresAt?: Date; // optional expiration (we're doing forever for v1)
}

// App state: everything the app needs to know right now
export interface AppState {
  currentPhotos: Photo[]; // photos user has taken/uploaded so far
  selectedThemeId: 'cottagecore' | '90s' | 'analog' | 'coastal' | 'botanical' | null; // which theme they picked
  selectedLayout: Layout | null; // which layout they picked
  selectedMode: Mode | null; // single or collage
  currentCollage: Collage | null; // the final collage being created
  isLoading: boolean; // while uploading/processing
  error: string | null; // error message if something went wrong
}

// Canvas render data: what the renderer needs to draw
export interface CanvasRenderData {
  width: number;
  height: number;
  backgroundColor: string; // hex color
  frameColor: string; // hex color
  frameBorderWidth: number; // 2, 4, or 6px
  cornerRadius: number; // 0, 4, or 12px
  photos: Photo[]; // photos to render
  positions: LayoutPosition[]; // where to put each photo
  stickers: Array<{
    svgCode: string;
    position: { x: number; y: number };
    size: number;
    opacity: number;
  }>; // decorative stickers
}

// API response types
export interface UploadResponse {
  success: boolean;
  imageUrl: string; // URL to the uploaded image in Supabase
  shareId: string; // the shareable link slug
}

export interface DownloadData {
  blob: Blob; // the image file to download
  filename: string; // what to name the file
}