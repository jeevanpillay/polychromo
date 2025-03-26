"use client";

import { useState, useMemo, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { hexToOKLCH, oklchToHex, getContrastColor } from "~/lib/color-utils";
import { useColorStore } from "~/store/use-color-store";

interface DesignContextProps {
  baseColor: string;
}

type BackgroundType = "light" | "dark" | "gradient" | "pattern";

const backgrounds = {
  light: "bg-white",
  dark: "bg-gray-900",
  gradient: "bg-gradient-to-br from-gray-100 to-gray-200",
  pattern: "bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]",
} as const;

const TextExamples = memo(({ baseColor }: { baseColor: string }) => {
  const oklch = hexToOKLCH(baseColor);
  const contrastColor = getContrastColor(oklch);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold">Text Examples</h3>
        <div className="space-y-2">
          <p style={{ color: baseColor }} className="text-2xl font-bold">
            Large Heading
          </p>
          <p style={{ color: baseColor }} className="text-lg">
            Regular Text
          </p>
          <p style={{ color: `${baseColor}80` }} className="text-sm">
            Secondary Text
          </p>
        </div>
      </CardContent>
    </Card>
  );
});

const UIElements = memo(({ baseColor }: { baseColor: string }) => {
  const oklch = hexToOKLCH(baseColor);
  const contrastColor = getContrastColor(oklch);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold">UI Elements</h3>
        <div className="space-y-4">
          <Button
            style={{ backgroundColor: baseColor, color: contrastColor }}
            className="hover:opacity-90"
          >
            Primary Button
          </Button>
          <Button
            variant="outline"
            style={{ borderColor: baseColor, color: baseColor }}
          >
            Secondary Button
          </Button>
          <div
            className="h-4 rounded-full"
            style={{ backgroundColor: oklchToHex({ ...oklch, l: oklch.l * 0.1 }) }}
          >
            <div
              className="h-full rounded-full"
              style={{ backgroundColor: baseColor, width: "60%" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

const CardExample = memo(({ baseColor }: { baseColor: string }) => {
  const oklch = hexToOKLCH(baseColor);
  const bgColor = oklchToHex({ ...oklch, l: oklch.l * 0.05 });

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold">Cards</h3>
        <Card style={{ backgroundColor: bgColor }}>
          <CardContent className="p-4">
            <h4 className="font-medium mb-2">Card Title</h4>
            <p className="text-sm text-muted-foreground">
              This is an example card with a subtle background color.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
});

const AccentExamples = memo(({ baseColor }: { baseColor: string }) => {
  const oklch = hexToOKLCH(baseColor);

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <h3 className="text-lg font-semibold">Accents</h3>
        <div className="space-y-2">
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: baseColor }}
          />
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: oklchToHex({ ...oklch, l: oklch.l * 0.4 }) }}
          />
          <div
            className="h-2 rounded-full"
            style={{ backgroundColor: oklchToHex({ ...oklch, l: oklch.l * 0.2 }) }}
          />
        </div>
      </CardContent>
    </Card>
  );
});

export function DesignContext({ baseColor }: DesignContextProps) {
  const [backgroundType, setBackgroundType] = useState<BackgroundType>("light");
  const { startColor } = useColorStore();

  const backgroundButtons = useMemo(() => 
    Object.keys(backgrounds).map((type) => ({
      type: type as BackgroundType,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    })), 
    []
  );

  const components = useMemo(() => ({
    text: <TextExamples baseColor={baseColor} />,
    ui: <UIElements baseColor={baseColor} />,
    card: <CardExample baseColor={baseColor} />,
    accent: <AccentExamples baseColor={baseColor} />,
  }), [baseColor]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          {backgroundButtons.map(({ type, label }) => (
            <Button
              key={type}
              variant={backgroundType === type ? "default" : "outline"}
              onClick={() => setBackgroundType(type)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className={`p-8 rounded-lg ${backgrounds[backgroundType]}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(components).map(([key, component]) => (
              <div key={key}>{component}</div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 