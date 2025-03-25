export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch' | 'className';

export const FORMAT_LABELS: Record<ColorFormat, string> = {
  oklch: 'OKLCH',
  hex: 'HEX',
  rgb: 'RGB',
  hsl: 'HSL',
  className: 'Class Name'
};

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function hexToHsl(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hexToOklch(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  // Convert to linear sRGB
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  // Convert to OKLCH (simplified approximation)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const C = Math.sqrt(
    Math.pow(0.7926039219 * l - 0.7918689247 * m - 0.0007349973 * s, 2) +
    Math.pow(0.0008434374 * l - 0.0009562962 * m + 0.1001128588 * s, 2)
  );
  const h = Math.atan2(
    0.0008434374 * l - 0.0009562962 * m + 0.1001128588 * s,
    0.7926039219 * l - 0.7918689247 * m - 0.0007349973 * s
  ) * (180 / Math.PI);

  return {
    l: L.toFixed(3),
    c: C.toFixed(3),
    h: ((h + 360) % 360).toFixed(1)
  };
}

function oklchToRgb(l: number, c: number, h: number) {
  // Convert OKLCH to RGB (simplified approximation)
  // This is a rough approximation and might need refinement
  const hRad = h * (Math.PI / 180);
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  
  // Convert to linear RGB (simplified)
  const r = Math.max(0, Math.min(255, Math.round(255 * (l + 0.4 * a))));
  const g = Math.max(0, Math.min(255, Math.round(255 * (l - 0.2 * a + 0.3 * b))));
  const b_ = Math.max(0, Math.min(255, Math.round(255 * (l - 0.2 * a - 0.3 * b))));
  
  return { r, g: g, b: b_ };
}

function oklchToHex(l: number, c: number, h: number): string {
  const rgb = oklchToRgb(l, c, h);
  return `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
}

function oklchToHsl(l: number, c: number, h: number) {
  const rgb = oklchToRgb(l, c, h);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h_ = 0, s, l_ = (max + min) / 2;

  if (max === min) {
    h_ = s = 0;
  } else {
    const d = max - min;
    s = l_ > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h_ = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h_ = (b - r) / d + 2; break;
      case b: h_ = (r - g) / d + 4; break;
    }
    h_ /= 6;
  }

  return {
    h: Math.round(h_ * 360),
    s: Math.round(s * 100),
    l: Math.round(l_ * 100)
  };
}

function parseOklch(color: string) {
  const match = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return null;
  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3])
  };
}

export function getFormattedColor(color: string, format: ColorFormat): string {
  // If the color is already in OKLCH format
  if (color.startsWith('oklch')) {
    const oklch = parseOklch(color);
    if (!oklch) return color;

    switch (format) {
      case 'oklch':
        return color;
      case 'hex':
        return oklchToHex(oklch.l, oklch.c, oklch.h);
      case 'rgb': {
        const rgb = oklchToRgb(oklch.l, oklch.c, oklch.h);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      }
      case 'hsl': {
        const hsl = oklchToHsl(oklch.l, oklch.c, oklch.h);
        return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      }
      case 'className':
        return `bg-[${color}]`;
      default:
        return color;
    }
  }
  
  // For backward compatibility with hex colors
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    if (!rgb) return color;

    switch (format) {
      case 'hex':
        return color;
      case 'rgb':
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      case 'hsl': {
        const hsl = hexToHsl(color);
        return hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : color;
      }
      case 'oklch': {
        const oklch = hexToOklch(color);
        return oklch ? `oklch(${oklch.l} ${oklch.c} ${oklch.h})` : color;
      }
      case 'className':
        return `bg-[${color}]`;
      default:
        return color;
    }
  }

  return color;
} 