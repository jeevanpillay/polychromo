export interface ColorData {
  color: string;
  name: string;
}

export interface OklchColor {
  l: number;  // Lightness: 0-1
  c: number;  // Chroma: 0-0.4 (approximately)
  h: number;  // Hue: 0-360
}

export interface ColorScale {
  base: OklchColor;
  variants: {
    [key: string]: OklchColor;
  };
  name: string;
}

export interface ColorFamily {
  name: string;
  baseHue: number;
  scales: ColorScale[];
}

export interface ColorPalette {
  families: ColorFamily[];
  lightness: number[];  // Predefined lightness steps
  chroma: number[];     // Predefined chroma steps
}

// Semantic color roles
export interface SemanticColors {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  neutral: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;
}
