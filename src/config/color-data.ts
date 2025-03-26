import { COLOR_PALETTE } from './color-system';
import { colorPaletteToColorData } from '~/lib/color-utils';

// Convert our new color system to the format expected by existing components
const colorData = colorPaletteToColorData(COLOR_PALETTE);

export const {
  BLUE_COLORS,
  RED_COLORS,
  GREEN_COLORS
} = colorData; 