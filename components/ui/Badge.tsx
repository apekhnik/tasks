import type { Priority, Difficulty } from '@/lib/constants'
import { PRIORITY_LABEL, DIFFICULTY_LABEL } from '@/lib/constants'
import type { Category } from '@/lib/db/schema'

export function PriorityBadge({ p }: { p: Priority }) {
  return (
    <span className={`badge badge-priority-${p.toLowerCase()}`}>
      <span className="dot" />
      {PRIORITY_LABEL[p]}
    </span>
  )
}

export function StatusBadge({ s }: { s: 'active' | 'done' | 'skipped' }) {
  return (
    <span className={`badge badge-status-${s}`}>
      {s === 'active' && 'В работе'}
      {s === 'done' && 'Готово'}
      {s === 'skipped' && 'Пропущено'}
    </span>
  )
}

export function CategoryTag({ cat }: { cat: Category }) {
  return (
    <span
      className="tag-cat"
      style={{
        color: cat.color,
        background: `${cat.color}1f`,
        borderColor: `${cat.color}40`,
      }}
    >
      <span className="dot" style={{ background: cat.color }} />
      {cat.name}
    </span>
  )
}

export function Diff({ level }: { level: Difficulty }) {
  const cls = level.toLowerCase()
  return (
    <span className={`diff ${cls}`} title={DIFFICULTY_LABEL[level]}>
      <span className="d" /><span className="d" /><span className="d" />
    </span>
  )
}
