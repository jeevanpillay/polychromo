"use client"

import { useState, memo } from 'react';
import { ColorSwatch } from './color-swatch';
import { ColorFormatSwitcher } from './color-format-switcher';
import type { ColorFormat } from '../lib/colors';
import type { ColorData } from "~/types/colors";

interface ColorGridProps {
  colors: ColorData[][];
  title: string;
}

export const ColorGrid = memo(function ColorGrid({ colors, title }: ColorGridProps) {
  const [format, setFormat] = useState<ColorFormat>('oklch');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between section-x">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <ColorFormatSwitcher 
          currentFormat={format}
          onFormatChange={setFormat}
        />
      </div>
      <div className="relative">
        <div className="grid grid-cols-20 gap-2 px-4 py-4 border-b border-dashed border-t rounded-sm">
          {colors.map((row, rowIndex) => (
            row.map((color, colIndex) => (
              <ColorSwatch
                key={`${rowIndex}-${colIndex}`}
                colorClass={color.color}
                name={color.name}
                format={format}
              />
            ))
          ))}
        </div>
      </div>
    </div>
  );
});