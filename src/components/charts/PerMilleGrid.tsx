import { useId } from 'react'
import { PER_MILLE } from '@/domain/gmf/constants'
import { cn } from '@/lib/utils'

const CELL = 10
const GAP = 2
const PITCH = CELL + GAP

interface GridShape {
  columns: number
  rows: number
}

const WIDE: GridShape = { columns: 50, rows: PER_MILLE / 50 }
const TALL: GridShape = { columns: 25, rows: PER_MILLE / 25 }

interface PerMilleGridProps {
  highlighted: number
  label: string
  className?: string
}

/**
 * One thousand cells, a handful lit: the literal meaning of "4 por mil".
 * Drawn as one patterned rect plus the highlighted cells, so the DOM stays
 * tiny instead of carrying a thousand nodes.
 */
export function PerMilleGrid({ highlighted, label, className }: PerMilleGridProps) {
  return (
    <div role="img" aria-label={label} className={className}>
      <GridSvg shape={WIDE} highlighted={highlighted} className="hidden sm:block" />
      <GridSvg shape={TALL} highlighted={highlighted} className="mx-auto max-w-72 sm:hidden" />
    </div>
  )
}

function GridSvg({
  shape,
  highlighted,
  className,
}: {
  shape: GridShape
  highlighted: number
  className: string
}) {
  const patternId = useId()
  const width = shape.columns * PITCH - GAP
  const height = shape.rows * PITCH - GAP
  const lastIndex = shape.columns * shape.rows - 1

  // Lit cells sit at the end of the grid: the last pesos of every thousand.
  const litCells = Array.from({ length: highlighted }, (_, offset) => {
    const index = lastIndex - offset
    return { x: (index % shape.columns) * PITCH, y: Math.floor(index / shape.columns) * PITCH }
  })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className={cn('h-auto w-full', className)}
    >
      <defs>
        <pattern id={patternId} width={PITCH} height={PITCH} patternUnits="userSpaceOnUse">
          <rect width={CELL} height={CELL} rx={2} className="fill-surface-3" />
        </pattern>
      </defs>
      <rect width={width} height={height} fill={`url(#${patternId})`} />
      {litCells.map((cell) => (
        <rect
          key={`${cell.x}-${cell.y}`}
          x={cell.x}
          y={cell.y}
          width={CELL}
          height={CELL}
          rx={2}
          className="fill-accent"
        />
      ))}
    </svg>
  )
}
