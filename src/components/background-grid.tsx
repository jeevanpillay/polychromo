export function BackgroundGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgb(75 85 99 / 0.2) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(75 85 99 / 0.2) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        backgroundPosition: "center center",
        WebkitMask: `linear-gradient(
          to bottom,
          transparent,
          rgba(0, 0, 0, 0) 30%,
          rgba(0, 0, 0, 1) 50%,
          rgba(0, 0, 0, 0) 70%,
          transparent
        )`,
      }}
      aria-hidden="true"
    />
  );
} 