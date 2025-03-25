"use client"

import { useState } from "react";
import { ColorSwatch } from "./color-swatch";
import { ColorFormatSwitcher, type ColorFormat } from "./color-format-switcher";

interface ColorGridProps {
  colors: Array<{ color: string; name: string; }>;
  title: string;
}

export function ColorGrid({ colors, title }: ColorGridProps) {
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
          {colors.map((color, index) => (
            <ColorSwatch
              key={index}
              colorClass={color.color}
              name={color.name}
              format={format}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 