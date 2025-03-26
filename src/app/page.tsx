import { ColorGrid } from '~/components/color-grid';
import { BLUE_COLORS, RED_COLORS, GREEN_COLORS } from '~/config/color-data';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="space-y-6 section-x">
          <h1 className="text-sm font-light">A library of polychrome colors...</h1>
        </section>

        {/* Color Sections */}
        <div className="space-y-16 section-y">
          <ColorGrid 
            title="Blue"
            colors={BLUE_COLORS}
          />
          <ColorGrid 
            title="Red"
            colors={RED_COLORS}
          />
          <ColorGrid 
            title="Green"
            colors={GREEN_COLORS}
          />
        </div>
      </main>
    </div>
  );
}