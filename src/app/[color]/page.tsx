import { Suspense } from "react";
import { ColorGradient } from "~/components/color/color-gradient";
import { ColorSpectrum } from "~/components/color/color-spectrum";
import { VisualEffects } from "~/components/color/visual-effects";
import { DesignContext } from "~/components/color/design-context";

interface ColorPageProps {
  params: {
    color: string;
  };
}

function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

export default function ColorPage({ params }: ColorPageProps) {
  // Validate the color parameter
  const isValidColor = isValidHexColor(params.color);
  const displayColor = isValidColor ? params.color : "#000000"; // Fallback to black if invalid

  return (
    <div className="container mx-auto py-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold">Color Gradient</h2>
        <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
          <ColorGradient baseColor={displayColor} />
        </Suspense>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Color Spectrum</h2>
        <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
          <ColorSpectrum baseColor={displayColor} />
        </Suspense>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Visual Effects</h2>
        <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
          <VisualEffects baseColor={displayColor} />
        </Suspense>
      </section>

      <section>
        <h2 className="text-2xl font-bold">Design Context</h2>
        <Suspense fallback={<div className="h-32 bg-muted animate-pulse rounded-lg" />}>
          <DesignContext baseColor={displayColor} />
        </Suspense>
      </section>
    </div>
  );
} 