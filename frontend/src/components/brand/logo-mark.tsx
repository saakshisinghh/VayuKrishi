// ─────────────────────────────────────────────────────────────────────────────
// src/components/brand/logo-mark.tsx
// The Vayukrishi circular sprout mark — forest green circle, cream sprout.
// Single source of truth for the icon used in the sidebar, auth cards, and
// anywhere else the brand mark appears. Renders as inline SVG so it stays
// crisp at any size and inherits no external image/network dependency.
// ─────────────────────────────────────────────────────────────────────────────

interface LogoMarkProps {
  /** Pixel size of the (square) mark. Defaults to 36, the header/sidebar size. */
  size?: number;
  className?: string;
}

export function LogoMark({ size = 36, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Vayukrishi"
    >
      <circle cx="60" cy="60" r="58" fill="#0f2c1d" />
      <circle cx="60" cy="60" r="49" fill="none" stroke="#faf8f3" strokeWidth="2" />
      <g transform="translate(60,64)">
        <path
          d="M 0,10 C 0,-14 -16,-20 -22,-30 C -8,-28 0,-20 0,-6 Z"
          fill="#faf8f3"
        />
        <path
          d="M 0,10 C 0,-14 16,-20 22,-30 C 8,-28 0,-20 0,-6 Z"
          fill="#faf8f3"
        />
        <rect x="-2.8" y="8" width="5.6" height="20" rx="2.5" fill="#faf8f3" />
      </g>
    </svg>
  );
}