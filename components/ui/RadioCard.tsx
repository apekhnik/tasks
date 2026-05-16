'use client'
interface RadioCardProps {
  selected?: boolean; onClick?: () => void
  title: React.ReactNode; hint?: string
  dot?: string | React.ReactNode; dotColor?: string
}

export function RadioCard({ selected, onClick, title, hint, dot }: RadioCardProps) {
  return (
    <div className={`radio-card${selected ? ' selected' : ''}`} onClick={onClick}>
      <span className="leader" />
      <div className="rc-content">
        <div className="rc-title">
          {dot !== undefined && (
            typeof dot === 'string'
              ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot }} />
              : dot
          )}
          {title}
        </div>
        {hint && <div className="rc-hint">{hint}</div>}
      </div>
    </div>
  )
}
