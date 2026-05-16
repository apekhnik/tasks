'use client'
import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Chip } from '@/components/ui/Chip'
import { Checkbox } from '@/components/ui/Checkbox'
import { PriorityBadge, CategoryTag, Diff } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { TaskModal } from '@/components/tasks/TaskModal'
import { ConfirmDialog } from '@/components/tasks/ConfirmDialog'
import { Icon } from '@/components/ui/Icon'
import { useToast } from '@/hooks/useToast'
import { createTask, updateTask, deleteTask, completeTask, uncompleteTask } from '@/lib/actions/tasks'
import type { TaskWithCategory } from '@/lib/types'
import type { Category } from '@/lib/db/schema'
import type { Priority } from '@/lib/constants'

interface TasksClientProps {
  initialTasks: TaskWithCategory[]
  categories: Category[]
}

export function TasksClient({ initialTasks, categories }: TasksClientProps) {
  const { toast } = useToast()
  const [tasks, setTasks] = useState(initialTasks)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [pri, setPri] = useState<Priority | 'all'>('all')
  const [cat, setCat] = useState<number | 'all'>('all')
  const [editingTask, setEditingTask] = useState<TaskWithCategory | null | 'new'>(null)
  const [confirmDel, setConfirmDel] = useState<TaskWithCategory | null>(null)

  const counts = {
    all: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    done: tasks.filter(t => t.completed).length,
  }

  const filtered = useMemo(() => {
    let list = tasks
    if (tab === 'active') list = list.filter(t => !t.completed)
    if (tab === 'done') list = list.filter(t => t.completed)
    if (pri !== 'all') list = list.filter(t => t.priority === pri)
    if (cat !== 'all') list = list.filter(t => t.categoryId === cat)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t => t.title.toLowerCase().includes(q) || (t.description ?? '').toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => {
      const order: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 }
      return order[a.priority] - order[b.priority]
    })
  }, [tasks, tab, search, pri, cat])

  const toggle = async (task: TaskWithCategory) => {
    const nowDone = !task.completed
    setTasks(ts => ts.map(t => t.id === task.id ? { ...t, completed: nowDone, completedAt: nowDone ? new Date() : null } : t))
    toast('success', nowDone ? `«${task.title}» — готово` : 'Возвращено в активные')
    if (nowDone) await completeTask(task.id)
    else await uncompleteTask(task.id)
  }

  const handleDelete = async () => {
    if (!confirmDel) return
    await deleteTask(confirmDel.id)
    setTasks(ts => ts.filter(t => t.id !== confirmDel.id))
    toast('info', 'Задача удалена')
    setConfirmDel(null)
  }

  return (
    <>
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <h1>Задачи</h1>
          <span className="sub t-mono">{counts.all}</span>
        </div>
        <div className="topbar-tabs" style={{ marginLeft: 18 }}>
          <Tabs value={tab} onChange={setTab} items={[
            { value: 'all', label: 'Все', count: counts.all },
            { value: 'active', label: 'Активные', count: counts.active },
            { value: 'done', label: 'Готовые', count: counts.done },
          ]} />
        </div>
        <div className="spacer" />
        <div className="topbar-add">
          <Button variant="primary" size="sm" icon="plus" onClick={() => setEditingTask('new')}>Добавить</Button>
        </div>
      </header>

      <main className="content content-narrow" style={{ maxWidth: 1200 }}>
        {/* Mobile tab pills — hidden on desktop */}
        <div className="mobile-tabs">
          {([['all', 'Все'], ['active', 'Активные'], ['done', 'Готовые']] as const).map(([v, l]) => (
            <button key={v} className={`mobile-tab${tab === v ? ' active' : ''}`} onClick={() => setTab(v)}>
              {l} <span>{counts[v]}</span>
            </button>
          ))}
        </div>

        <div className="tasks-toolbar fade-up">
          <div className="input-wrap tasks-search-wrap">
            <span className="leading"><Icon name="search" size={14} /></span>
            <input
              className="input has-icon"
              placeholder="Поиск задач..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="tasks-chips-row">
            <div className="chip-group">
              {([['all','Все'],['HIGH','Срочно'],['MEDIUM','Средне'],['LOW','Низкий']] as const).map(([v,l]) => (
                <Chip key={v} active={pri === v} onClick={() => setPri(v)}>{l}</Chip>
              ))}
            </div>
            <div className="tasks-divider" />
            <div className="chip-group">
              <Chip active={cat === 'all'} onClick={() => setCat('all')}>Все</Chip>
              {categories.map(c => (
                <Chip key={c.id} active={cat === c.id} dot dotColor={c.color} onClick={() => setCat(c.id)}>{c.name}</Chip>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="card fade-up" style={{ padding: 0 }}>
            <EmptyState
              icon={search ? 'search' : 'check-square'}
              title={search ? 'Ничего не нашлось' : 'Список пуст'}
              sub={search ? 'Попробуй другой запрос.' : 'Добавь первую задачу.'}
              cta={
                search
                  ? <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setPri('all'); setCat('all') }}>Сбросить</Button>
                  : <Button variant="primary" size="sm" icon="plus" onClick={() => setEditingTask('new')}>Добавить задачу</Button>
              }
            />
          </div>
        ) : (
          <div className="card fade-up" style={{ padding: 0 }}>
            <div className="tbl-head">
              <div /><div /><div>Задача</div><div>Приоритет</div><div>Категория</div><div>Сложность</div><div />
            </div>
            {filtered.map(t => (
              <div
                key={t.id}
                className={`tbl-row priority-${t.priority.toLowerCase()}${t.completed ? ' completed' : ''}`}
                onClick={() => setEditingTask(t)}
              >
                <div className="task-cb-wrap" onClick={e => e.stopPropagation()}>
                  <Checkbox checked={t.completed} onChange={() => toggle(t)} />
                </div>
                <div className="tbl-bar" />
                <div style={{ minWidth: 0 }}>
                  <div className="tbl-title">{t.title}</div>
                  {t.description && <div className="tbl-desc">{t.description}</div>}
                  {/* Mobile: priority + difficulty shown inline under title */}
                  <div className="task-mobile-meta">
                    <PriorityBadge p={t.priority} />
                    <Diff level={t.difficulty} />
                    {t.category && (
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.category.color, display: 'inline-block', flexShrink: 0 }} />
                    )}
                  </div>
                </div>
                <div><PriorityBadge p={t.priority} /></div>
                <div>{t.category && <CategoryTag cat={t.category} />}</div>
                <div><Diff level={t.difficulty} /></div>
                <div className="tbl-actions" onClick={e => e.stopPropagation()}>
                  <span className="task-action" onClick={() => setEditingTask(t)}><Icon name="pencil" size={14} /></span>
                  <span className="task-action danger" onClick={() => setConfirmDel(t)}><Icon name="trash" size={14} /></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile FAB — hidden on desktop */}
      <button className="mobile-fab" onClick={() => setEditingTask('new')} aria-label="Добавить задачу">
        <Icon name="plus" size={22} />
      </button>

      {editingTask !== null && (
        <TaskModal
          task={editingTask === 'new' ? null : editingTask}
          categories={categories}
          onClose={() => setEditingTask(null)}
          onSave={async data => {
            if (data.id) {
              await updateTask(data.id, data)
              toast('success', 'Изменения сохранены')
            } else {
              await createTask(data)
              toast('success', 'Задача добавлена')
            }
            setEditingTask(null)
          }}
          onDelete={setConfirmDel}
        />
      )}
      {confirmDel && (
        <ConfirmDialog
          title="Удалить задачу?"
          body={<>Задача «<span style={{ color: 'var(--text-1)' }}>{confirmDel.title}</span>» исчезнет навсегда.</>}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDel(null)}
        />
      )}
    </>
  )
}
