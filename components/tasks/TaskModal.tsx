'use client'
import { useState, useRef, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { RadioCard } from '@/components/ui/RadioCard'
import { Diff } from '@/components/ui/Badge'
import type { TaskWithCategory } from '@/lib/types'
import type { Category } from '@/lib/db/schema'
import type { Priority, Difficulty } from '@/lib/constants'

interface TaskFormData {
  title: string; description: string
  priority: Priority; difficulty: Difficulty; categoryId: number | null
}

interface TaskModalProps {
  task?: TaskWithCategory | null
  categories: Category[]
  onClose: () => void
  onSave: (data: TaskFormData & { id?: number }) => Promise<void>
  onDelete?: (task: TaskWithCategory) => void
}

export function TaskModal({ task, categories, onClose, onSave, onDelete }: TaskModalProps) {
  const isEdit = !!task?.id
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'MEDIUM')
  const [difficulty, setDifficulty] = useState<Difficulty>(task?.difficulty ?? 'EASY')
  const [categoryId, setCategoryId] = useState<number | null>(task?.categoryId ?? null)
  const [saving, setSaving] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => { titleRef.current?.focus() }, [])

  const canSave = title.trim().length > 0

  const submit = async () => {
    if (!canSave || saving) return
    setSaving(true)
    try {
      await onSave({ id: task?.id, title: title.trim(), description: description.trim(), priority, difficulty, categoryId })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={isEdit ? 'Редактировать задачу' : 'Новая задача'}
      onClose={onClose}
      footer={
        <>
          {isEdit && task && (
            <Button variant="danger" size="md" icon="trash" onClick={() => onDelete?.(task)}>Удалить</Button>
          )}
          <div className="spacer" />
          <Button variant="ghost" size="md" onClick={onClose}>Отмена</Button>
          <Button variant="primary" size="md" onClick={submit} loading={saving} disabled={!canSave} icon={!saving ? 'check' : undefined}>
            Сохранить
          </Button>
        </>
      }
    >
      <div className="field">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label className="field-label">Название</label>
          {title.length > 80 && <span className={`field-helper${title.length > 100 ? ' is-error' : ''}`}>{title.length}/100</span>}
        </div>
        <input
          ref={titleRef}
          className="input"
          placeholder="Например: помыть посуду"
          maxLength={100}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
      </div>

      <div className="field">
        <label className="field-label">Описание <span className="text-3" style={{ fontWeight: 400 }}>· опционально</span></label>
        <textarea
          className="textarea"
          placeholder="Детали, контекст, ссылки"
          maxLength={500}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <div className="task-form-grid">
        <div className="field priority-picker">
          <label className="field-label">Приоритет</label>
          <div className="radio-grid">
            {([['HIGH','Срочно','В первую очередь','var(--red)'],['MEDIUM','Средне','При возможности','var(--amber)'],['LOW','Низкий','Когда будет время','var(--blue)']] as const).map(([v,t,h,c]) => (
              <RadioCard key={v} selected={priority === v} onClick={() => setPriority(v)} title={t} hint={h} dot={c} />
            ))}
          </div>
        </div>

        <div className="field difficulty-picker">
          <label className="field-label">Сложность</label>
          <div className="radio-grid">
            {([['EASY','Лёгкая','до 15 минут'],['MEDIUM','Средняя','15–60 минут'],['HARD','Сложная','больше часа']] as const).map(([v,t,h]) => (
              <RadioCard key={v} selected={difficulty === v} onClick={() => setDifficulty(v)}
                title={<span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>{t} <Diff level={v} /></span>}
                hint={h} />
            ))}
          </div>
        </div>

        <div className="field category-picker">
          <label className="field-label">Категория</label>
          <div className="radio-grid category-picker-grid">
            {categories.map(c => (
              <RadioCard key={c.id} selected={categoryId === c.id} onClick={() => setCategoryId(c.id)}
                title={c.name} dot={c.color} />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
