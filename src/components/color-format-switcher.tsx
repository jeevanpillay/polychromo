"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch' | 'className';

interface ColorFormatSwitcherProps {
  onFormatChange: (format: ColorFormat) => void;
  currentFormat: ColorFormat;
}

const FORMAT_LABELS: Record<ColorFormat, string> = {
  hex: 'hex',
  rgb: 'rgb',
  hsl: 'hsl',
  oklch: 'oklch',
  className: 'className'
};

export function ColorFormatSwitcher({ onFormatChange, currentFormat }: ColorFormatSwitcherProps) {
  const handleValueChange = (value: string) => {
    onFormatChange(value as ColorFormat);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-secondary hover:bg-secondary/80">
        <span className="font-mono text-xs">format <span className="font-bold">{FORMAT_LABELS[currentFormat]}</span></span>
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={currentFormat} onValueChange={handleValueChange}>
          {Object.entries(FORMAT_LABELS).map(([format, label]) => (
            <DropdownMenuRadioItem
              key={format}
              value={format as ColorFormat}
            >
              <span className="font-mono text-xs">{label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 