'use client'
interface ChipProps {
  active?: boolean; dot?: boolean; dotColor?: string;
  onClick?: () => void; children: React.ReactNode
}

export function Chip({ active, dot, dotColor, onClick, children }: ChipProps) {
  return (
    <button className={`chip${active ? ' active' : ''}`} onClick={onClick}>
      {dot && <span className="dot" style={{ background: dotColor || 'currentColor' }} />}
      {children}
    </button>
  )
}
