import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { tasks, categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Progress } from '@/components/ui/Progress'
import { Stat } from '@/components/ui/Stat'
import { Icon } from '@/components/ui/Icon'

export default async function ProgressPage() {
  const { userId } = await auth()
  if (!userId) return null

  const [allTasks, userCategories] = await Promise.all([
    db.select().from(tasks).where(eq(tasks.userId, userId)),
    db.select().from(categories).where(eq(categories.userId, userId)),
  ])

  const done = allTasks.filter(t => t.completed)
  const successRate = allTasks.length === 0 ? 0 : Math.round(done.length / allTasks.length * 100)

  const now = new Date()
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    d.setHours(0, 0, 0, 0)
    const next = new Date(d); next.setDate(next.getDate() + 1)
    return done.filter(t => {
      const ct = t.completedAt ? new Date(t.completedAt) : null
      return ct && ct >= d && ct < next
    }).length
  })
  const max = Math.max(...weekData, 1)

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const todayIdx = (new Date().getDay() + 6) % 7

  return (
    <>
      <header className="topbar">
        <h1>Прогресс</h1>
      </header>

      <main className="content content-narrow" style={{ maxWidth: 1100 }}>
        <div className="grid grid-4 mb-2xl fade-up">
          <Stat value={done.length} label="Выполнено" accent="accent" />
          <Stat value={allTasks.filter(t => !t.completed).length} label="Активных" />
          <Stat value={`${successRate}%`} label="Завершено" />
          <Stat value={weekData.reduce((a, b) => a + b, 0)} label="За 7 дней" accent="accent" />
        </div>

        <div className="cols-two fade-up" style={{ animationDelay: '80ms' }}>
          <div className="card">
            <div className="section-label">
              <span>Задачи по дням</span>
              <span className="count">всего {weekData.reduce((a, b) => a + b, 0)}</span>
            </div>
            <div className="bars">
              {weekData.map((v, i) => (
                <div
                  key={i}
                  className={`bar${v > 0 ? ' has-data' : ''}${i === todayIdx ? ' today' : ''}`}
                  data-tip={`${weekDays[i]} · ${v} задач`}
                  style={{ height: `${(v / max) * 100}%` }}
                />
              ))}
            </div>
            <div className="bars-axis">{weekDays.map(d => <span key={d}>{d}</span>)}</div>
          </div>

          <div className="card">
            <div className="section-label"><span>По категориям</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {userCategories.map(c => {
                const list = allTasks.filter(t => t.categoryId === c.id)
                const d = list.filter(t => t.completed).length
                const tot = list.length
                const pct = tot === 0 ? 0 : Math.round(d / tot * 100)
                return (
                  <div key={c.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
                        {c.name}
                      </div>
                      <span className="t-mono text-3">{d}/{tot}</span>
                    </div>
                    <Progress value={pct} color={c.color} tall />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="card fade-up" style={{ marginTop: 24, animationDelay: '140ms' }}>
          <div className="section-label">
            <span>История</span><span className="count">{done.length}</span>
          </div>
          <div>
            {done.slice(0, 10).map(t => {
              const c = userCategories.find(x => x.id === t.categoryId)
              return (
                <div key={t.id} className="hist-row">
                  <div className="h-check"><Icon name="check" size={10} /></div>
                  <div className="h-body">
                    <div className="h-title">{t.title}</div>
                    <div className="h-meta">
                      {c && <span style={{ color: c.color }}>● {c.name}</span>}
                    </div>
                  </div>
                  <div className="h-date">
                    {t.completedAt ? new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'short' }).format(new Date(t.completedAt)) : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </>
  )
}
