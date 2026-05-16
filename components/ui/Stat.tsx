interface StatProps {
  value: string | number; label: string
  accent?: string; trend?: { dir: 'up' | 'down'; value: number }
}

export function Stat({ value, label, accent, trend }: StatProps) {
  return (
    <div className="stat">
      <div className={`v ${accent || ''} tabular`}>{value}</div>
      <div className="l">
        <span>{label}</span>
        {trend && (
          <span className={`trend ${trend.dir}`}>
            {trend.dir === 'up' ? '↑' : '↓'}{trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
