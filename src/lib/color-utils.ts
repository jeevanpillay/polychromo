import type { ColorData, OklchColor, ColorScale, ColorFamily, ColorPalette } from '~/types/colors';

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch' | 'className';

export const FORMAT_LABELS: Record<ColorFormat, string> = {
  oklch: 'OKLCH',
  hex: 'HEX',
  rgb: 'RGB',
  hsl: 'HSL',
  className: 'Class Name'
};

export function oklchToString({ l, c, h }: OklchColor): string {
  return `oklch(${l} ${c} ${h})`;
}

export function stringToOklch(color: string): OklchColor | null {
  const match = color.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
  if (!match) return null;
  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3])
  };
}

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

export function hexToOKLCH(hex: string): OklchColor {
  const rgb = hexToRgb(hex);
  if (!rgb) throw new Error('Invalid hex color');
  
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
    l: L,
    c: C,
    h: ((h + 360) % 360)
  };
}

export function oklchToHex(color: OklchColor): string {
  // Convert OKLCH to RGB (simplified approximation)
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);
  
  // Convert to linear RGB (simplified)
  const r = Math.max(0, Math.min(255, Math.round(255 * (color.l + 0.4 * a))));
  const g = Math.max(0, Math.min(255, Math.round(255 * (color.l - 0.2 * a + 0.3 * b))));
  const b_ = Math.max(0, Math.min(255, Math.round(255 * (color.l - 0.2 * a - 0.3 * b))));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b_.toString(16).padStart(2, '0')}`;
}

export function oklchToHsl(color: OklchColor) {
  const rgb = oklchToRgb(color);
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

export function oklchToRgb(color: OklchColor) {
  const hRad = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(hRad);
  const b = color.c * Math.sin(hRad);
  
  const r = Math.max(0, Math.min(255, Math.round(255 * (color.l + 0.4 * a))));
  const g = Math.max(0, Math.min(255, Math.round(255 * (color.l - 0.2 * a + 0.3 * b))));
  const b_ = Math.max(0, Math.min(255, Math.round(255 * (color.l - 0.2 * a - 0.3 * b))));
  
  return { r, g, b: b_ };
}

export function getFormattedColor(color: string, format: ColorFormat): string {
  // If the color is already in OKLCH format
  if (color.startsWith('oklch')) {
    const oklch = stringToOklch(color);
    if (!oklch) return color;

    switch (format) {
      case 'oklch':
        return color;
      case 'hex':
        return oklchToHex(oklch);
      case 'rgb': {
        const rgb = oklchToRgb(oklch);
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      }
      case 'hsl': {
        const hsl = oklchToHsl(oklch);
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
        const oklch = hexToOKLCH(color);
        return oklchToString(oklch);
      }
      case 'className':
        return `bg-[${color}]`;
      default:
        return color;
    }
  }

  return color;
}

export function colorScaleToColorData(scale: ColorScale): ColorData[] {
  const result: ColorData[] = [];
  
  // Add base color
  result.push({
    color: oklchToString(scale.base),
    name: scale.name
  });
  
  // Add variants
  Object.entries(scale.variants).forEach(([variant, color]) => {
    result.push({
      color: oklchToString(color),
      name: `${scale.name}-${variant}`
    });
  });
  
  return result;
}

export function colorFamilyToColorData(family: ColorFamily): ColorData[][] {
  return family.scales.map(scale => colorScaleToColorData(scale));
}

export function colorPaletteToColorData(palette: ColorPalette): { [key: string]: ColorData[][] } {
  const result: { [key: string]: ColorData[][] } = {};
  
  palette.families.forEach(family => {
    const key = `${family.name.toUpperCase()}_COLORS`;
    result[key] = colorFamilyToColorData(family);
  });
  
  return result;
}

export function interpolateOklch(color1: OklchColor, color2: OklchColor, t: number): OklchColor {
  return {
    l: color1.l + (color2.l - color1.l) * t,
    c: color1.c + (color2.c - color1.c) * t,
    h: color1.h + (color2.h - color1.h) * t
  };
}

export function generateColorScale(base: OklchColor, steps: number): OklchColor[] {
  const result: OklchColor[] = [];
  const darkColor: OklchColor = { ...base, l: Math.max(0.1, base.l - 0.3) };
  const lightColor: OklchColor = { ...base, l: Math.min(0.98, base.l + 0.3) };
  
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    if (t < 0.5) {
      result.push(interpolateOklch(darkColor, base, t * 2));
    } else {
      result.push(interpolateOklch(base, lightColor, (t - 0.5) * 2));
    }
  }
  
  return result;
}

export function isInGamut(color: OklchColor): boolean {
  // This is a simplified gamut check
  // For more accurate results, you'd want to convert to RGB and check if values are between 0-1
  return (
    color.l >= 0 && color.l <= 1 &&
    color.c >= 0 && color.c <= 0.4 &&
    color.h >= 0 && color.h <= 360
  );
}

export function findClosestInGamutColor(color: OklchColor): OklchColor {
  if (isInGamut(color)) return color;
  
  // If out of gamut, reduce chroma until in gamut
  let newColor = { ...color };
  while (!isInGamut(newColor) && newColor.c > 0) {
    newColor.c = Math.max(0, newColor.c - 0.01);
  }
  
  return newColor;
}

export function getContrastColor(color: OklchColor): string {
  return color.l > 0.5 ? "#000000" : "#ffffff";
} 