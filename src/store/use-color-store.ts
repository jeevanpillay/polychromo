import { create } from "zustand";
import { type OklchColor } from "~/types/colors";
import { hexToOKLCH } from "~/lib/color-utils";

interface ColorState {
  startColor: OklchColor;
  endColor: OklchColor;
  steps: number;
  setStartColor: (color: OklchColor) => void;
  setEndColor: (color: OklchColor) => void;
  setSteps: (steps: number) => void;
  setStartColorFromHex: (hex: string) => void;
  setEndColorFromHex: (hex: string) => void;
  getGradientColors: () => OklchColor[];
}

export const useColorStore = create<ColorState>((set, get) => ({
  startColor: { l: 0.5, c: 0.1, h: 0 },
  endColor: { l: 0.7, c: 0.1, h: 0 },
  steps: 5,

  setStartColor: (color) => set({ startColor: color }),
  setEndColor: (color) => set({ endColor: color }),
  setSteps: (steps) => set({ steps }),
  
  setStartColorFromHex: (hex) => set({ startColor: hexToOKLCH(hex) }),
  setEndColorFromHex: (hex) => set({ endColor: hexToOKLCH(hex) }),

  getGradientColors: () => {
    const { startColor, endColor, steps } = get();
    const colors: OklchColor[] = [];

    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      colors.push({
        l: startColor.l + (endColor.l - startColor.l) * t,
        c: startColor.c + (endColor.c - startColor.c) * t,
        h: startColor.h + (endColor.h - startColor.h) * t,
      });
    }

    return colors;
  },
})); 