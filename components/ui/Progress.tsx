interface ProgressProps { value: number; color?: string; tall?: boolean }

export function Progress({ value, color, tall }: ProgressProps) {
  const v = Math.max(0, Math.min(100, value))
  const c = color || (v < 31 ? 'var(--red)' : v < 71 ? 'var(--amber)' : 'var(--accent)')
  return (
    <div className={`progress${tall ? ' tall' : ''}`}>
      <div style={{ width: `${v}%`, background: c }} />
    </div>
  )
}
