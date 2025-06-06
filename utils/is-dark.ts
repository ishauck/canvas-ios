// Detects if a color is dark based on luminance
// Supports hex (#RRGGBB, #RGB), rgb(), and rgba() formats
export default function isDark(color: string): boolean {
  let r: number, g: number, b: number;

  // Remove whitespace and convert to lower case
  color = color.replace(/\s+/g, '').toLowerCase();

  // Hex format
  if (color[0] === '#') {
    if (color.length === 4) {
      // #RGB
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else if (color.length === 7) {
      // #RRGGBB
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else {
      throw new Error('Invalid hex color format');
    }
  } else if (color.startsWith('rgb(') || color.startsWith('rgba(')) {
    // rgb() or rgba()
    const values = color.match(/rgba?\(([^)]+)\)/);
    if (!values) throw new Error('Invalid rgb/rgba color format');
    const parts = values[1].split(',').map(Number);
    [r, g, b] = parts;
  } else {
    throw new Error('Unsupported color format');
  }

  // Calculate luminance
  // Formula: https://www.w3.org/TR/AERT/#color-contrast
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
  return luminance < 128;
}
