import type { Accent } from '@/data/ongoing'

interface Props {
  value: number // 0–100
  accent?: Accent
}

export default function ProgressBar({ value, accent }: Props) {
  const clamped = Math.max(0, Math.min(100, value))
  const target = clamped / 100
  return (
    <div className="bar" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`bar__fill${accent ? ` bar__fill--${accent}` : ''}`}
        style={{ ['--bar-target' as string]: target }}
      />
    </div>
  )
}
