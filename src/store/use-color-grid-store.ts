import { create } from 'zustand'
import type { ColorFormat } from '~/lib/color-utils'

interface ColorState {
  format: ColorFormat
  setFormat: (format: ColorFormat) => void
}

export const useColorGridStore = create<ColorState>((set) => ({
  format: 'oklch',
  setFormat: (format) => set({ format }),
})) 