import type { Layout, LayoutPosition } from '../types/index';

// Helper: creates a position object
const createPosition = (x: number, y: number, width: number, height: number): LayoutPosition => ({
  x,
  y,
  width,
  height,
});

// Layouts for 1 photo
const getLayout1Photo = (): Layout => ({
  id: 'single',
  name: 'Single Frame',
  positions: [createPosition(10, 10, 80, 80)], // one photo, centered, 80% of canvas
});

// Layouts for 2 photos
const getLayout2Photos = (): Layout[] => [
  {
    id: 'sideBySide',
    name: 'Side-by-side',
    positions: [
      createPosition(5, 10, 45, 80), // left photo
      createPosition(50, 10, 45, 80), // right photo
    ],
  },
  {
    id: 'stacked',
    name: 'Stacked',
    positions: [
      createPosition(10, 5, 80, 45), // top photo
      createPosition(10, 50, 80, 45), // bottom photo
    ],
  },
  {
    id: '1big1small',
    name: '1 Big + 1 Small',
    positions: [
      createPosition(5, 10, 65, 80), // big photo on left
      createPosition(65, 10, 35, 80), // small photo on right
    ],
  },
];

// Layouts for 3 photos
const getLayout3Photos = (): Layout[] => [
  {
    id: 'rowOf3',
    name: 'Row of 3',
    positions: [
      createPosition(3, 15, 30, 70), // left
      createPosition(35, 15, 30, 70), // center
      createPosition(67, 15, 30, 70), // right
    ],
  },
  {
    id: '1big2small',
    name: '1 Big + 2 Small',
    positions: [
      createPosition(5, 10, 60, 80), // big photo
      createPosition(60, 10, 40, 40), // small top right
      createPosition(60, 50, 40, 40), // small bottom right
    ],
  },
  {
    id: 'triangle',
    name: 'Triangle',
    positions: [
      createPosition(10, 10, 35, 50), // top left
      createPosition(55, 10, 35, 50), // top right
      createPosition(32, 55, 35, 40), // bottom center
    ],
  },
];

// Layouts for 4 photos
const getLayout4Photos = (): Layout[] => [
  {
    id: '2x2Grid',
    name: '2x2 Grid',
    positions: [
      createPosition(5, 5, 45, 45), // top left
      createPosition(50, 5, 45, 45), // top right
      createPosition(5, 50, 45, 45), // bottom left
      createPosition(50, 50, 45, 45), // bottom right
    ],
  },
  {
    id: '1big3small',
    name: '1 Big + 3 Small',
    positions: [
      createPosition(5, 10, 60, 80), // big photo
      createPosition(60, 10, 40, 30), // small top
      createPosition(60, 40, 40, 30), // small middle
      createPosition(60, 70, 40, 25), // small bottom
    ],
  },
  {
    id: '2top2bottom',
    name: '2 Top + 2 Bottom',
    positions: [
      createPosition(5, 5, 45, 45), // top left
      createPosition(50, 5, 45, 45), // top right
      createPosition(5, 50, 45, 45), // bottom left
      createPosition(50, 50, 45, 45), // bottom right
    ],
  },
];

// Layouts for 5-6 photos
const getLayout56Photos = (): Layout[] => [
  {
    id: '2x3Grid',
    name: '2x3 Grid',
    positions: [
      createPosition(3, 5, 30, 45), // row 1
      createPosition(35, 5, 30, 45),
      createPosition(67, 5, 30, 45),
      createPosition(3, 50, 30, 45), // row 2
      createPosition(35, 50, 30, 45),
      createPosition(67, 50, 30, 45),
    ],
  },
  {
    id: 'masonry',
    name: 'Masonry',
    positions: [
      createPosition(3, 5, 32, 40), // left column, tall
      createPosition(38, 5, 30, 30), // middle column, shorter
      createPosition(38, 35, 30, 60),
      createPosition(70, 5, 27, 35), // right column
      createPosition(70, 40, 27, 35),
      createPosition(70, 75, 27, 20),
    ],
  },
  {
    id: '3x2Grid',
    name: '3x2 Grid',
    positions: [
      createPosition(3, 5, 30, 45), // row 1
      createPosition(35, 5, 30, 45),
      createPosition(67, 5, 30, 45),
      createPosition(12, 50, 30, 45), // row 2 (centered)
      createPosition(44, 50, 30, 45),
      createPosition(76, 50, 20, 45), // 6th photo smaller on right
    ],
  },
];

/**
 * Get all available layouts for a given photo count
 * @param photoCount - how many photos the user has
 * @returns array of available layouts for that photo count
 */
export const getLayoutsForPhotoCount = (photoCount: number): Layout[] => {
  switch (photoCount) {
    case 1:
      return [getLayout1Photo()];
    case 2:
      return getLayout2Photos();
    case 3:
      return getLayout3Photos();
    case 4:
      return getLayout4Photos();
    case 5:
    case 6:
      return getLayout56Photos();
    default:
      return [getLayout1Photo()]; // fallback
  }
};

/**
 * Get the default (recommended) layout for a photo count
 * This is what the system suggests first
 * @param photoCount - how many photos
 * @returns the recommended layout
 */
export const getDefaultLayout = (photoCount: number): Layout => {
  const layouts = getLayoutsForPhotoCount(photoCount);
  return layouts[0]; // first layout is always the default
};

/**
 * Get a specific layout by ID and photo count
 * @param photoCount - how many photos
 * @param layoutId - which layout to get
 * @returns the layout object, or undefined if not found
 */
export const getLayoutById = (photoCount: number, layoutId: string): Layout | undefined => {
  const layouts = getLayoutsForPhotoCount(photoCount);
  return layouts.find((layout) => layout.id === layoutId);
};