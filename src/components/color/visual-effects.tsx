'use client';

import { useState, useMemo, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { hexToOKLCH, oklchToHex, getContrastColor } from "~/lib/color-utils";

interface VisualEffectsProps {
  baseColor: string;
}

const HeroSection = memo(({ baseColor }: { baseColor: string }) => {
  const oklch = hexToOKLCH(baseColor);
  const contrastColor = getContrastColor(oklch);

  return (
    <div className="min-h-[400px] p-8" style={{ backgroundColor: baseColor }}>
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold" style={{ color: contrastColor }}>
          Welcome to Our Platform
        </h1>
        <p className="text-lg" style={{ color: contrastColor + "E6" }}>
          Experience the power of color in design with our innovative solutions.
        </p>
        <Button
          variant="secondary"
          className="bg-white text-black hover:bg-white/90"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
});

const FeaturesSection = memo(({ baseColor }: { baseColor: string }) => {
  const oklch = hexToOKLCH(baseColor);
  const bgColor = oklchToHex({ ...oklch, l: oklch.l * 0.1 });

  return (
    <div className="min-h-[400px] p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} style={{ backgroundColor: bgColor }}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Feature {i}</h3>
              <p className="text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

const CTASection = memo(({ baseColor }: { baseColor: string }) => {
  const oklch = hexToOKLCH(baseColor);
  const bgColor = oklchToHex({ ...oklch, l: oklch.l * 0.05 });
  const contrastColor = getContrastColor(oklch);

  return (
    <div className="min-h-[400px] p-8" style={{ backgroundColor: bgColor }}>
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-3xl font-bold" style={{ color: contrastColor }}>
          Ready to Get Started?
        </h2>
        <p className="text-lg text-muted-foreground">
          Join thousands of satisfied customers who have transformed their designs.
        </p>
        <Button
          style={{ backgroundColor: baseColor, color: contrastColor }}
          className="hover:opacity-90"
        >
          Sign Up Now
        </Button>
      </div>
    </div>
  );
});

export function VisualEffects({ baseColor }: VisualEffectsProps) {
  const [activeSection, setActiveSection] = useState("hero");

  const sections = useMemo(() => ({
    hero: <HeroSection baseColor={baseColor} />,
    features: <FeaturesSection baseColor={baseColor} />,
    cta: <CTASection baseColor={baseColor} />,
  }), [baseColor]);

  const buttons = useMemo(() => [
    { id: "hero", label: "Hero Section" },
    { id: "features", label: "Features Section" },
    { id: "cta", label: "CTA Section" },
  ], []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visual Effects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          {buttons.map(({ id, label }) => (
            <Button
              key={id}
              variant={activeSection === id ? "default" : "outline"}
              onClick={() => setActiveSection(id)}
            >
              {label}
            </Button>
          ))}
        </div>

        <div className="border rounded-lg overflow-hidden">
          {sections[activeSection as keyof typeof sections]}
        </div>
      </CardContent>
    </Card>
  );
} 