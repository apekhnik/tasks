import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { tasks, categories } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { RouletteClient } from './RouletteClient'

export default async function RoulettePage() {
  const { userId } = await auth()
  if (!userId) return null

  const [allTasks, userCategories] = await Promise.all([
    db.select().from(tasks).where(eq(tasks.userId, userId)),
    db.select().from(categories).where(eq(categories.userId, userId)),
  ])

  const catMap = Object.fromEntries(userCategories.map(c => [c.id, c]))
  const tasksWithCat = allTasks.map(t => ({ ...t, category: t.categoryId ? catMap[t.categoryId] ?? null : null }))

  return <RouletteClient initialTasks={tasksWithCat} categories={userCategories} />
}
