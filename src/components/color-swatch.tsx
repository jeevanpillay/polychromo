"use client"

import { useState, useCallback, memo } from 'react';
import { Check, Copy } from 'lucide-react';
import { getFormattedColor } from '~/lib/color-utils';
import type { ColorFormat } from '~/lib/color-utils';
import { cn } from '~/lib/utils';

interface ColorSwatchProps {
  colorClass: string;
  name: string;
  format: ColorFormat;
}

export const ColorSwatch = memo(function ColorSwatch({ colorClass, name, format }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);
  const formattedColor = getFormattedColor(colorClass, format);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formattedColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [formattedColor]);

  return (
    <div className="group relative aspect-square">
      <button
        onClick={handleCopy}
        className={cn(
          'w-full h-full rounded-sm transition-transform duration-200 ease-in-out hover:scale-110 hover:z-10 focus:outline-none focus:ring-2 border focus:ring-offset-2 focus:ring-blue-500',
        )}
        style={{ backgroundColor: colorClass }}
        title={`${name} - ${formattedColor}`}
        aria-label={`Copy ${name} color: ${formattedColor}`}
      >
        <span className="sr-only">Copy color: {formattedColor}</span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {copied ? (
            <Check className="w-4 h-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
          ) : (
            <Copy className="w-4 h-4 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
          )}
        </div>
      </button>
    </div>
  );
});