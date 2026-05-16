'use client'
interface CheckboxProps { checked: boolean; onChange: (v: boolean) => void }

export function Checkbox({ checked, onChange }: CheckboxProps) {
  return (
    <span
      onClick={e => { e.stopPropagation(); onChange(!checked) }}
      className={`cb${checked ? ' checked' : ''}`}
    >
      <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
        <polyline points="4 10 8 14 16 6" stroke="#07140d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}
