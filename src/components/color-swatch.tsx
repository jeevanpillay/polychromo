"use client"

import { cn } from "~/lib/utils";
import { useState, useCallback, memo } from "react";
import { Check, Clipboard } from "lucide-react";

interface ColorSwatchProps {
  colorClass: string;
  name: string;
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

export const ColorSwatch = memo(function ColorSwatch({ colorClass, name }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(colorClass);
      setCopied(true);
      const timer = setTimeout(() => setCopied(false), 1000);
      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [colorClass]);
  
  return (
    <div className="space-y-1.5">
      <ColorSwatchCard 
        color={colorClass}
        onClick={handleCopy}
        title={`${name} - ${colorClass}`}
        aria-label={`Copy color ${name} (${colorClass})`}
      >
        <CopyOverlay copied={copied} />
      </ColorSwatchCard>
      {/* <p className="text-xs text-muted-foreground">{name}</p> */}
    </div>
  );
});