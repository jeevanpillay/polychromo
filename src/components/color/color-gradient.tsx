'use client';

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";
import { oklchToHex } from "~/lib/color-utils";
import { OklchColorSelector } from "./oklch-color-selector";
import { useColorStore } from "~/store/use-color-store";

interface ColorGradientProps {
  baseColor: string;
}

export function ColorGradient({ baseColor }: ColorGradientProps) {
  const { 
    startColor, 
    endColor, 
    steps, 
    setSteps, 
    setStartColorFromHex, 
    setEndColorFromHex,
    getGradientColors 
  } = useColorStore();

  useEffect(() => {
    setStartColorFromHex(baseColor);
    setEndColorFromHex(baseColor);
  }, [baseColor, setStartColorFromHex, setEndColorFromHex]);

  const gradientColors = getGradientColors();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Gradient</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OklchColorSelector isStartColor={true} />
          <OklchColorSelector isStartColor={false} />
        </div>

        <div className="space-y-2">
          <Label>Number of Steps: {steps}</Label>
          <Slider
            value={[steps]}
            onValueChange={([value]) => setSteps(value)}
            min={2}
            max={10}
            step={1}
          />
        </div>

        <div className="space-y-4">
          <div className="h-8 rounded-md overflow-hidden flex">
            {gradientColors.map((color, index) => (
              <div
                key={index}
                className="flex-1"
                style={{ backgroundColor: oklchToHex(color) }}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gradientColors.map((color, index) => (
              <div key={index} className="space-y-2">
                <div
                  className="h-24 rounded-md border"
                  style={{ backgroundColor: oklchToHex(color) }}
                />
                <div className="text-sm font-mono">
                  <p>L: {color.l.toFixed(2)}</p>
                  <p>C: {color.c.toFixed(2)}</p>
                  <p>H: {color.h.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 