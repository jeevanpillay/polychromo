import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Slider } from "~/components/ui/slider";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { hexToOKLCH, oklchToHex } from "~/lib/color-utils";
import { type OklchColor } from "~/types/colors";
import { useColorStore } from "~/store/use-color-store";

interface OklchColorSelectorProps {
  initialColor?: string;
  onChange?: (color: string) => void;
  isStartColor?: boolean;
}

export function OklchColorSelector({ 
  initialColor = "#000000", 
  onChange,
  isStartColor = true 
}: OklchColorSelectorProps) {
  const [previewColor, setPreviewColor] = useState(initialColor);
  const initialOklch = useMemo(() => hexToOKLCH(initialColor), [initialColor]);
  
  const { 
    startColor, 
    endColor, 
    setStartColor, 
    setEndColor,
    setStartColorFromHex,
    setEndColorFromHex
  } = useColorStore();

  const currentColor = isStartColor ? startColor : endColor;
  const setColor = isStartColor ? setStartColor : setEndColor;
  const setColorFromHex = isStartColor ? setStartColorFromHex : setEndColorFromHex;

  const handleSliderChange = (field: keyof OklchColor, value: number) => {
    const newColor = { ...currentColor, [field]: value };
    setColor(newColor);
    const hexColor = oklchToHex(newColor);
    setPreviewColor(hexColor);
    onChange?.(hexColor);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isStartColor ? "Start Color" : "End Color"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Lightness (L)</Label>
            <div className="flex gap-4">
              <Slider
                value={[currentColor.l]}
                onValueChange={([value]) => handleSliderChange("l", value)}
                min={0}
                max={1}
                step={0.01}
                className="flex-1"
              />
              <Input
                type="number"
                value={currentColor.l}
                onChange={(e) => handleSliderChange("l", parseFloat(e.target.value))}
                min={0}
                max={1}
                step={0.01}
                className="w-20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Chroma (C)</Label>
            <div className="flex gap-4">
              <Slider
                value={[currentColor.c]}
                onValueChange={([value]) => handleSliderChange("c", value)}
                min={0}
                max={0.4}
                step={0.01}
                className="flex-1"
              />
              <Input
                type="number"
                value={currentColor.c}
                onChange={(e) => handleSliderChange("c", parseFloat(e.target.value))}
                min={0}
                max={0.4}
                step={0.01}
                className="w-20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Hue (H)</Label>
            <div className="flex gap-4">
              <Slider
                value={[currentColor.h]}
                onValueChange={([value]) => handleSliderChange("h", value)}
                min={0}
                max={360}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                value={currentColor.h}
                onChange={(e) => handleSliderChange("h", parseFloat(e.target.value))}
                min={0}
                max={360}
                step={1}
                className="w-20"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="flex gap-4">
            <div
              className="w-full h-12 rounded-md border"
              style={{ backgroundColor: previewColor }}
            />
            <Input
              value={previewColor}
              readOnly
              className="w-32 font-mono"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 