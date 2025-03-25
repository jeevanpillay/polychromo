import { create } from 'zustand'
import type { ColorFormat } from '../lib/colors'

interface ColorState {
  format: ColorFormat
  setFormat: (format: ColorFormat) => void
}

export const useColorStore = create<ColorState>((set) => ({
  format: 'oklch',
  setFormat: (format) => set({ format }),
})) 