"use client"

import { cn } from "~/lib/utils";
import { useState, useCallback, memo } from "react";
import { Check, Clipboard } from "lucide-react";
import { ColorFormat } from "./color-format-switcher";

interface ColorSwatchProps {
  colorClass: string;
  name: string;
  format?: ColorFormat;
}

const ColorSwatchCard = memo(function ColorSwatchCard({ 
  className,
  color,
  ...props 
}: React.ComponentProps<"button"> & { color: string }) {
  return (
    <button
      data-slot="card"
      className={cn(
        "aspect-square rounded-sm w-full border shadow-xs relative group/swatch transition-transform duration-200 hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring/50",
        className
      )}
      style={{ backgroundColor: color }}
      {...props}
    />
  )
});

const CopyOverlay = memo(function CopyOverlay({ copied }: { copied: boolean }) {
  return (
    <span 
      className="absolute inset-0 flex items-center justify-center text-xs font-medium opacity-0 group-hover/swatch:opacity-100 bg-black/50 text-white rounded-sm transition-opacity duration-200"
      aria-hidden={!copied}
    >
      {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
    </span>
  );
});

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function hexToHsl(hex: string) {
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

function hexToOklch(hex: string) {
  // This is a simplified conversion. For accurate OKLCH conversion,
  // you might want to use a color conversion library
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  // Simplified conversion to OKLCH
  const l = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
  return {
    l: Math.round((l / 255) * 100) / 100,
    c: 0.2, // Simplified chroma
    h: 250  // Simplified hue for blue
  };
}

function getFormattedColor(color: string, format: ColorFormat) {
  switch (format) {
    case 'hex':
      return color;
    case 'rgb': {
      const rgb = hexToRgb(color);
      return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : color;
    }
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

export const ColorSwatch = memo(function ColorSwatch({ colorClass, name, format = 'hex' }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);
  const formattedColor = getFormattedColor(colorClass, format);
  
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formattedColor);
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [formattedColor]);
  
  return (
    <div className="space-y-1.5">
      <ColorSwatchCard 
        color={colorClass}
        onClick={handleCopy}
        title={`${name} - ${formattedColor}`}
        aria-label={`Copy color ${name} (${formattedColor})`}
      >
        <CopyOverlay copied={copied} />
      </ColorSwatchCard>
      {/* <p className="text-xs text-muted-foreground">{name}</p> */}
    </div>
  );
});