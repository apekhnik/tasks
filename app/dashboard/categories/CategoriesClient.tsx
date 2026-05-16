'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Progress } from '@/components/ui/Progress'
import { TaskModal } from '@/components/tasks/TaskModal'
import { CategoryModal } from '@/components/tasks/CategoryModal'
import { useToast } from '@/hooks/useToast'
import { createTask } from '@/lib/actions/tasks'
import { createCategory } from '@/lib/actions/categories'
import type { TaskWithCategory } from '@/lib/types'
import type { Category } from '@/lib/db/schema'
import { DIFFICULTY_LABEL, DURATIONS } from '@/lib/constants'
import type { IconName } from '@/components/ui/Icon'

interface CategoriesClientProps {
  initialTasks: TaskWithCategory[]
  categories: Category[]
}

export function CategoriesClient({ initialTasks, categories }: CategoriesClientProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [tasks] = useState(initialTasks)
  const [selected, setSelected] = useState<number | null>(null)
  const [addingTask, setAddingTask] = useState(false)
  const [addingCategory, setAddingCategory] = useState(false)

  const selectedCat = categories.find(c => c.id === selected)

  return (
    <>
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <h1>Категории</h1>
          <span className="sub t-mono">{categories.length}</span>
        </div>
        <div className="spacer" />
        <Button variant="primary" size="sm" icon="plus" onClick={() => setAddingCategory(true)}>
          Новая категория
        </Button>
      </header>

      <main className="content">
        <div className="grid grid-cats fade-up">
          {categories.map(c => {
            const list = tasks.filter(t => t.categoryId === c.id)
            const active = list.filter(t => !t.completed)
            const done = list.filter(t => t.completed)
            const total = list.length
            const pct = total === 0 ? 0 : Math.round(done.length / total * 100)
            const preview = active.slice(0, 3)
            const more = active.length - preview.length
            const isSel = selected === c.id
            const allDone = total > 0 && active.length === 0

            return (
              <div
                key={c.id}
                className={`cat-card${isSel ? ' selected' : ''}`}
                onClick={() => setSelected(c.id)}
              >
                <div className="cat-card-head">
                  <div className="cat-icon" style={{ background: `${c.color}1a`, border: `1px solid ${c.color}40`, color: c.color }}>
                    <Icon name={c.icon as IconName} size={18} />
                  </div>
                  {allDone ? (
                    <span className="badge badge-status-done"><Icon name="check" size={12} /> Готово</span>
                  ) : (
                    <span className="t-mono text-3" style={{ fontSize: 11 }}>{active.length} активных</span>
                  )}
                </div>
                <div>
                  <div className="cat-name">{c.name}</div>
                  <div className="cat-sub">{done.length} из {total} выполнено</div>
                  <Progress value={pct} color={c.color} />
                </div>
                <div className="cat-preview">
                  {preview.length === 0 ? (
                    <div className="cat-preview-more">Все задачи выполнены ✓</div>
                  ) : (
                    <>
                      {preview.map(t => (
                        <div key={t.id} className="cat-preview-item">
                          <span className="marker" style={{ background: t.priority === 'HIGH' ? 'var(--red)' : t.priority === 'MEDIUM' ? 'var(--amber)' : 'var(--blue)' }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</span>
                        </div>
                      ))}
                      {more > 0 && <div className="cat-preview-more">+ ещё {more} задач</div>}
                    </>
                  )}
                </div>
              </div>
            )
          })}

          <div className="cat-card add" onClick={() => setAddingCategory(true)}>
            <Icon name="plus" size={24} />
            <div className="t-body-sm">Создать категорию</div>
            <div className="t-caption text-3">иконка · цвет · название</div>
          </div>
        </div>
      </main>

      {selected !== null && (
        <div className="mobile-overlay" onClick={() => setSelected(null)} />
      )}

      {selected !== null && selectedCat && (() => {
        const list = tasks.filter(t => t.categoryId === selectedCat.id)
        const active = list.filter(t => !t.completed)
        const done = list.filter(t => t.completed)
        return (
          <aside className="right-panel" style={{ animation: 'slideInRight 300ms cubic-bezier(.2,.7,.2,1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="cat-icon" style={{ background: `${selectedCat.color}1a`, border: `1px solid ${selectedCat.color}40`, color: selectedCat.color, width: 32, height: 32, borderRadius: 8 }}>
                <Icon name={selectedCat.icon as IconName} size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="t-h3">{selectedCat.name}</div>
                <div className="t-caption text-3">{list.length} задач · {done.length} готово</div>
              </div>
              <span className="icon-btn" onClick={() => setSelected(null)}><Icon name="x" size={14} /></span>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="stat" style={{ padding: 12 }}>
                <div className="v" style={{ fontSize: 22 }}>{active.length}</div>
                <div className="l">Осталось</div>
              </div>
              <div className="stat" style={{ padding: 12 }}>
                <div className="v accent" style={{ fontSize: 22 }}>{done.length}</div>
                <div className="l">Готово</div>
              </div>
            </div>

            <div>
              <div className="section-label"><span>Задачи</span><span className="count">{active.length}</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 360, overflow: 'auto' }}>
                {active.length === 0 ? (
                  <div className="t-body-sm text-3" style={{ padding: '12px 4px' }}>Всё выполнено.</div>
                ) : active.map(t => (
                  <div key={t.id} className={`rp-task priority-${t.priority.toLowerCase()}`}>
                    <div className="rp-bar" />
                    <div className="rp-body">
                      <div className="rp-title">{t.title}</div>
                      <div className="rp-meta">{DIFFICULTY_LABEL[t.difficulty]} · {DURATIONS[t.difficulty]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1" />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="ghost" size="md" icon="plus" onClick={() => setAddingTask(true)}>Задача</Button>
              <Button variant="primary" size="md" icon="dice" onClick={() => {
                if (active.length === 0) return toast('info', 'Нет задач для рулетки')
                router.push('/dashboard/roulette')
              }}>Крутить</Button>
            </div>
          </aside>
        )
      })()}

      {addingTask && (
        <TaskModal
          categories={categories}
          onClose={() => setAddingTask(false)}
          onSave={async data => {
            await createTask({ ...data, categoryId: selectedCat?.id ?? data.categoryId })
            toast('success', 'Задача добавлена')
            setAddingTask(false)
          }}
        />
      )}
      {addingCategory && (
        <CategoryModal
          onClose={() => setAddingCategory(false)}
          onSave={async data => {
            await createCategory(data)
            toast('success', `Категория «${data.name}» создана`)
            setAddingCategory(false)
            router.refresh()
          }}
        />
      )}
    </>
  )
}
