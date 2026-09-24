/**
 * Ledger grid, a flat price line and a few stray figures. Everything is
 * decorative, very low contrast and hidden from assistive tech.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <div className="absolute inset-0 bg-ledger opacity-70" />

      <svg
        viewBox="0 0 1200 240"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-40 w-full opacity-60 sm:h-56"
      >
        <path
          d="M0 170 L80 164 L140 172 L210 150 L260 158 L330 132 L390 140 L450 118 L520 126 L580 96 L640 108 L700 88 L760 100 L830 70 L890 82 L950 58 L1010 66 L1080 44 L1140 52 L1200 36"
          fill="none"
          stroke="var(--color-line-strong)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 200 H1200"
          stroke="var(--color-line)"
          strokeDasharray="2 6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <span className="absolute bottom-24 left-[42%] hidden font-mono tabular text-[0.625rem] text-faint/60 lg:block">
        0,004 × 1.000 = 4
      </span>
      <span className="absolute bottom-10 left-[4%] hidden font-mono tabular text-[0.625rem] text-faint/60 sm:block">
        GMF / COP
      </span>
    </div>
  )
}
