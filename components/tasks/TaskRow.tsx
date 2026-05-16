'use client'
import { Icon } from '@/components/ui/Icon'
import { Checkbox } from '@/components/ui/Checkbox'
import { PriorityBadge, CategoryTag, Diff } from '@/components/ui/Badge'
import { DURATIONS } from '@/lib/constants'
import type { TaskWithCategory } from '@/lib/types'

interface TaskRowProps {
  task: TaskWithCategory
  onToggle?: (task: TaskWithCategory) => void
  onEdit?: (task: TaskWithCategory) => void
  onDelete?: (task: TaskWithCategory) => void
  selected?: boolean
}

export function TaskRow({ task, onToggle, onEdit, onDelete, selected }: TaskRowProps) {
  const completed = task.completed
  return (
    <div
      className={`task priority-${task.priority.toLowerCase()}${completed ? ' completed' : ''}${selected ? ' selected' : ''}`}
      onClick={() => onEdit?.(task)}
    >
      <div className="task-bar" />
      <div className="task-cb-wrap">
        <Checkbox checked={completed} onChange={() => onToggle?.(task)} />
      </div>
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
        <div className="task-meta">
          <PriorityBadge p={task.priority} />
          {task.category && <CategoryTag cat={task.category} />}
          <Diff level={task.difficulty} />
          <span className="t-caption text-3" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="clock" size={12} />
            {DURATIONS[task.difficulty]}
          </span>
        </div>
      </div>
      <div className="task-actions" onClick={e => e.stopPropagation()}>
        <span className="task-action" onClick={() => onEdit?.(task)}><Icon name="pencil" size={14} /></span>
        <span className="task-action danger" onClick={() => onDelete?.(task)}><Icon name="trash" size={14} /></span>
      </div>
    </div>
  )
}
