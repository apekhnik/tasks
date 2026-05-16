'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { Stat } from '@/components/ui/Stat'
import { Progress } from '@/components/ui/Progress'
import { TaskRow } from '@/components/tasks/TaskRow'
import { TaskModal } from '@/components/tasks/TaskModal'
import { ConfirmDialog } from '@/components/tasks/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { PriorityBadge, Diff } from '@/components/ui/Badge'
import { useToast } from '@/hooks/useToast'
import { createTask, updateTask, deleteTask, completeTask } from '@/lib/actions/tasks'
import { DURATIONS, DIFFICULTY_LABEL } from '@/lib/constants'
import type { TaskWithCategory } from '@/lib/types'
import type { Category } from '@/lib/db/schema'
import type { Priority, Difficulty } from '@/lib/constants'

interface Filters { priority: Priority | 'all'; category: number | 'all'; difficulty: Difficulty | 'all' }

interface RouletteClientProps {
  initialTasks: TaskWithCategory[]
  categories: Category[]
}

export function RouletteClient({ initialTasks, categories }: RouletteClientProps) {
  const { toast } = useToast()
  const [tasks, setTasks] = useState(initialTasks)
  const [activeTaskId, setActiveTaskId] = useState<number | null>(initialTasks.find(t => !t.completed)?.id ?? null)
  const [filters, setFilters] = useState<Filters>({ priority: 'all', category: 'all', difficulty: 'all' })
  const [spinning, setSpinning] = useState(false)
  const [flipKey, setFlipKey] = useState(0)
  const [editingTask, setEditingTask] = useState<TaskWithCategory | null | 'new'>(null)
  const [confirmDel, setConfirmDel] = useState<TaskWithCategory | null>(null)

  const active = tasks.filter(t => !t.completed)
  const filtered = active.filter(t => {
    if (filters.priority !== 'all' && t.priority !== filters.priority) return false
    if (filters.category !== 'all' && t.categoryId !== filters.category) return false
    if (filters.difficulty !== 'all' && t.difficulty !== filters.difficulty) return false
    return true
  })

  const current = tasks.find(t => t.id === activeTaskId) || filtered[0] || null

  const todayDone = tasks.filter(t => t.completed && t.completedAt && isToday(t.completedAt)).length
  const urgent = active.filter(t => t.priority === 'HIGH').length

  const spin = () => {
    if (filtered.length === 0) return
    setSpinning(true)
    setTimeout(() => {
      const pool = filtered.filter(t => t.id !== activeTaskId)
      const pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : filtered[0]
      setActiveTaskId(pick.id)
      setSpinning(false)
      setFlipKey(k => k + 1)
    }, 800)
  }

  const complete = async () => {
    if (!current) return
    setTasks(ts => ts.map(t => t.id === current.id ? { ...t, completed: true, completedAt: new Date() } : t))
    toast('success', `«${current.title}» — отмечено как готово`)
    await completeTask(current.id)
    setTimeout(spin, 320)
  }

  const skip = () => {
    if (!current) return
    toast('info', `Пропустили «${current.title}»`)
    spin()
  }

  const recentDone = tasks.filter(t => t.completed).slice(0, 3)
  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const weekData = [3, 5, 2, 4, 6, 3, 1]

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Рулетка <span style={{ marginLeft: 4 }}>🎲</span></h1>
          <span className="sub">{formatDate()}</span>
        </div>
        <div className="spacer" />
        <Button variant="ghost" size="sm" icon="plus" onClick={() => setEditingTask('new')}>Задача</Button>
        <Button variant="primary" size="sm" icon="dice" onClick={spin}>Крутить</Button>
      </header>

      <main className="content">
        <div className="grid grid-3 mb-xl fade-up">
          <Stat value={active.length} label="Всего активных" />
          <Stat value={urgent} label="Срочных" accent={urgent > 0 ? 'amber' : ''} />
          <Stat value={todayDone} label="Сегодня готово" accent="accent" />
        </div>

        {filtered.length === 0 ? (
          <div className="roulette fade-up">
            <div className="eyebrow">Рулетка пуста</div>
            <EmptyState
              icon="dice"
              title="Под фильтр ничего не подошло"
              sub="Сбрось фильтры или добавь новую задачу."
              cta={
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="ghost" size="sm" onClick={() => setFilters({ priority: 'all', category: 'all', difficulty: 'all' })}>Сбросить</Button>
                  <Button variant="primary" size="sm" icon="plus" onClick={() => setEditingTask('new')}>Добавить</Button>
                </div>
              }
            />
          </div>
        ) : current ? (
          <div key={flipKey} className={`roulette fade-up flip-anim${spinning ? ' spinning' : ''}`}>
            <div className="eyebrow">Задача дня</div>
            {spinning ? (
              <>
                <div className="skeleton-line" style={{ width: '78%', height: 28 }} />
                <div className="skeleton-line" style={{ width: '52%', height: 28 }} />
                <div className="skeleton-line" style={{ width: '40%', height: 14, marginTop: 14 }} />
              </>
            ) : (
              <>
                <h2 className="roulette-title">{current.title}</h2>
                <div className="roulette-sub">
                  {current.category && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: current.category.color }} />
                      {current.category.name}
                    </span>
                  )}
                  <span className="sep">·</span>
                  <span>{DURATIONS[current.difficulty]}</span>
                  <span className="sep">·</span>
                  <span>{DIFFICULTY_LABEL[current.difficulty]}</span>
                </div>
                <div className="roulette-badges">
                  <PriorityBadge p={current.priority} />
                  <Diff level={current.difficulty} />
                </div>
              </>
            )}
            <div className="roulette-divider" />
            <div className="roulette-actions">
              <Button variant="ghost" size="md" icon="skip" onClick={skip} disabled={spinning}>Пропустить</Button>
              <Button variant="ghost" size="md" icon="refresh" onClick={spin} disabled={spinning}>Другая</Button>
              <div className="spacer" />
              <Button variant="primary" size="md" icon="check" onClick={complete} disabled={spinning}>Выполнено</Button>
            </div>
          </div>
        ) : null}

        <div className="cols-two" style={{ marginTop: 32 }}>
          <div className="fade-up">
            <div className="section-label">
              <span>В очереди</span><span className="count">{filtered.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.filter(t => t.id !== current?.id).slice(0, 4).map(t => (
                <TaskRow
                  key={t.id} task={t}
                  onEdit={setEditingTask}
                  onToggle={async task => {
                    setTasks(ts => ts.map(x => x.id === task.id ? { ...x, completed: true, completedAt: new Date() } : x))
                    toast('success', `«${task.title}» — готово`)
                    await completeTask(task.id)
                  }}
                  onDelete={setConfirmDel}
                />
              ))}
            </div>
          </div>

          <div className="fade-up">
            <div className="section-label"><span>Категории на сегодня</span></div>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {categories.map(c => {
                const inCat = active.filter(t => t.categoryId === c.id).length
                const done = tasks.filter(t => t.categoryId === c.id && t.completed).length
                const total = inCat + done
                const pct = total === 0 ? 0 : Math.round(done / total * 100)
                return (
                  <div key={c.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                        {c.name}
                      </div>
                      <span className="t-mono text-3">{done}/{total}</span>
                    </div>
                    <Progress value={pct} color={c.color} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      <aside className="right-panel">
        <div>
          <div className="section-label"><span>Фильтр рулетки</span></div>
          <div className="t-caption text-3" style={{ marginBottom: 6 }}>Приоритет</div>
          <div className="chip-group mb-md">
            {([['all','Все'],['HIGH','Срочно'],['MEDIUM','Средне'],['LOW','Низкий']] as const).map(([v,l]) => (
              <Chip key={v} active={filters.priority === v} onClick={() => setFilters(f => ({ ...f, priority: v }))}>{l}</Chip>
            ))}
          </div>
          <div className="t-caption text-3" style={{ marginBottom: 6 }}>Сложность</div>
          <div className="chip-group mb-md">
            {([['all','Любая'],['EASY','Лёгкая'],['MEDIUM','Средняя'],['HARD','Сложная']] as const).map(([v,l]) => (
              <Chip key={v} active={filters.difficulty === v} onClick={() => setFilters(f => ({ ...f, difficulty: v }))}>{l}</Chip>
            ))}
          </div>
          <div className="t-caption text-3" style={{ marginBottom: 6 }}>Категория</div>
          <div className="chip-group">
            <Chip active={filters.category === 'all'} onClick={() => setFilters(f => ({ ...f, category: 'all' }))}>Все</Chip>
            {categories.map(c => (
              <Chip key={c.id} active={filters.category === c.id} dot dotColor={c.color}
                onClick={() => setFilters(f => ({ ...f, category: c.id }))}>{c.name}</Chip>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div>
          <div className="section-label"><span>Недавно выполнено</span><span className="count">{recentDone.length}</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentDone.map(t => (
              <div key={t.id} className={`rp-task priority-${t.priority.toLowerCase()}`}>
                <div className="rp-bar" />
                <div className="rp-body">
                  <div className="rp-title" style={{ textDecoration: 'line-through' }}>{t.title}</div>
                  <div className="rp-meta">{t.completedAt ? formatDateTime(t.completedAt) : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <div>
          <div className="section-label"><span>Эта неделя</span><span className="count">{weekData.reduce((a,b) => a+b,0)}</span></div>
          <div className="mini-bars">
            {weekData.map((v, i) => (
              <div key={i} className={`b${v > 0 ? ' has-data' : ''}${i === new Date().getDay() - 1 ? ' today' : ''}`}
                style={{ height: `${Math.max(8, v * 12)}px` }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 6, textAlign: 'center' }}>
            {weekDays.map(d => <div key={d} className="t-mono text-3" style={{ fontSize: 10 }}>{d}</div>)}
          </div>
        </div>
      </aside>

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
          onConfirm={async () => {
            await deleteTask(confirmDel.id)
            setTasks(ts => ts.filter(t => t.id !== confirmDel.id))
            toast('info', 'Задача удалена')
            setConfirmDel(null)
            setEditingTask(null)
          }}
          onCancel={() => setConfirmDel(null)}
        />
      )}
    </>
  )
}

function isToday(date: Date | null): boolean {
  if (!date) return false
  const d = new Date(date)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

function formatDate(): string {
  return new Intl.DateTimeFormat('ru', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(date))
}
