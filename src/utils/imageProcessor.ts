import type { Adjustments } from '../types/index';

/**
 * Apply brightness and saturation adjustments to a canvas
 * This manipulates the pixel data to adjust the image
 * @param ctx - canvas 2D context
 * @param x - x position on canvas
 * @param y - y position on canvas
 * @param width - width of image
 * @param height - height of image
 * @param brightness - 0-100 (50 = default, no change)
 * @param saturation - 0-100 (50 = default, no change)
 */
export const applyImageAdjustments = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  brightness: number = 50,
  saturation: number = 50
): void => {
  // Get the image data from this region
  const imageData = ctx.getImageData(x, y, width, height);
  const data = imageData.data; // RGBA values

  // Convert brightness (0-100) to a multiplier (-1 to 1)
  const brightnessMultiplier = (brightness - 50) / 50;

  // Convert saturation (0-100) to a multiplier (0 to 2)
  const saturationMultiplier = saturation / 50;

  // Loop through every pixel (every 4 values = RGBA)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3]; // alpha (transparency)

    // BRIGHTNESS: Add/subtract from RGB values
    let newR = r + brightnessMultiplier * 127;
    let newG = g + brightnessMultiplier * 127;
    let newB = b + brightnessMultiplier * 127;

    // Clamp values between 0-255
    newR = Math.max(0, Math.min(255, newR));
    newG = Math.max(0, Math.min(255, newG));
    newB = Math.max(0, Math.min(255, newB));

    // SATURATION: Convert RGB to HSL, adjust S, convert back
    const { h, s, l } = rgbToHsl(newR, newG, newB);
    const newS = Math.max(0, Math.min(100, s * saturationMultiplier));
    const { r: satR, g: satG, b: satB } = hslToRgb(h, newS, l);

    // Write adjusted values back
    data[i] = satR;
    data[i + 1] = satG;
    data[i + 2] = satB;
    data[i + 3] = a; // keep alpha unchanged
  }

  // Put the modified image data back on canvas
  ctx.putImageData(imageData, x, y);
};

/**
 * Convert RGB to HSL (Hue, Saturation, Lightness)
 * HSL is better for adjusting saturation
 * @returns object with h, s, l values (0-100 scale)
 */
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
};

/**
 * Convert HSL back to RGB
 * @returns object with r, g, b values (0-255 scale)
 */
const hslToRgb = (h: number, s: number, l: number) => {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

/**
 * Create a canvas with adjusted image
 * Useful for previewing adjustments in real-time
 * @param image - the image to adjust
 * @param adjustments - brightness and saturation values
 * @returns canvas element with adjusted image
 */
export const createAdjustedCanvas = (
  image: HTMLImageElement,
  adjustments: Adjustments
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Draw the image first
  ctx.drawImage(image, 0, 0);

  // Apply adjustments
  applyImageAdjustments(
    ctx,
    0,
    0,
    image.width,
    image.height,
    adjustments.brightness,
    adjustments.saturation
  );

  return canvas;
};

/**
 * Draw an image on canvas with adjustments already applied
 * @param ctx - canvas context
 * @param image - the image to draw
 * @param x, y, width, height - position and size on canvas
 * @param adjustments - brightness/saturation to apply
 */
export const drawImageWithAdjustments = (
  ctx: CanvasRenderingContext2D,
  image: CanvasImageSource,
  x: number,
  y: number,
  width: number,
  height: number,
  adjustments: Adjustments
): void => {
  // Draw the image
  ctx.drawImage(image, x, y, width, height);

  // Apply adjustments to that region
  applyImageAdjustments(ctx, x, y, width, height, adjustments.brightness, adjustments.saturation);
};