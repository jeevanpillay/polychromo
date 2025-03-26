import type { ColorData, OklchColor, ColorScale, ColorFamily, ColorPalette } from '~/types/colors';

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