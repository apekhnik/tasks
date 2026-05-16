'use client'
interface TabItem { value: string; label: string; count?: number }
interface TabsProps { items: TabItem[]; value: string; onChange: (v: string) => void }

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div className="tabs">
      {items.map(it => (
        <button
          key={it.value}
          className={`tab${value === it.value ? ' active' : ''}`}
          onClick={() => onChange(it.value)}
        >
          <span>{it.label}</span>
          {it.count !== undefined && <span className="tab-count">{it.count}</span>}
        </button>
      ))}
    </div>
  )
}
