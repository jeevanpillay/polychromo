'use client';
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { hexToOKLCH, oklchToHex, generateColorScale } from "~/lib/color-utils";
import { type OklchColor } from "~/types/colors";

interface ColorSpectrumProps {
  baseColor: string;
}

const ITEMS_PER_PAGE = 5;
const VISIBLE_ITEMS = 15; // Show 3 rows at a time

export function ColorSpectrum({ baseColor }: ColorSpectrumProps) {
  const baseOKLCH = useMemo(() => hexToOKLCH(baseColor), [baseColor]);
  const [colors, setColors] = useState<OklchColor[]>([]);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const generateColors = useCallback((startIndex: number, count: number) => {
    return generateColorScale(baseOKLCH, count);
  }, [baseOKLCH]);

  useEffect(() => {
    if (inView) {
      const newColors = generateColors(page * ITEMS_PER_PAGE, ITEMS_PER_PAGE);
      setColors(prev => [...prev, ...newColors]);
      setPage(prev => prev + 1);
    }
  }, [inView, page, generateColors]);

  // Memoize visible colors
  const visibleColors = useMemo(() => {
    return colors.slice(0, VISIBLE_ITEMS);
  }, [colors]);

  // Memoize color card component
  const ColorCard = useCallback(({ color }: { color: OklchColor }) => (
    <Card className="overflow-hidden">
      <div
        className="aspect-square p-4 flex flex-col justify-between"
        style={{ backgroundColor: oklchToHex(color) }}
      >
        <div className="text-sm font-mono">
          <p>L: {color.l.toFixed(2)}</p>
          <p>C: {color.c.toFixed(2)}</p>
          <p>H: {color.h.toFixed(2)}</p>
        </div>
        <div className="text-sm font-mono">
          {oklchToHex(color)}
        </div>
      </div>
    </Card>
  ), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Spectrum</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {visibleColors.map((color, index) => (
            <ColorCard key={index} color={color} />
          ))}
          <div ref={ref} className="h-20" />
        </div>
      </CardContent>
    </Card>
  );
} 