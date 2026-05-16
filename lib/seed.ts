import { db } from '@/lib/db'
import { categories, type NewCategory } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const DEFAULT_CATEGORIES: Omit<NewCategory, 'userId'>[] = [
  { name: 'Дом',      icon: 'home',      color: '#6b9eff' },
  { name: 'Работа',   icon: 'briefcase', color: '#b48bff' },
  { name: 'Здоровье', icon: 'heart',     color: '#4aba78' },
  { name: 'Дела',     icon: 'shopping',  color: '#e2a341' },
  { name: 'Личное',   icon: 'user',      color: '#e57eb0' },
  { name: 'Учёба',    icon: 'book',      color: '#5fc4cf' },
]

export async function seedDefaultCategories(userId: string) {
  const existing = await db.select().from(categories).where(eq(categories.userId, userId))
  if (existing.length > 0) return

  await db.insert(categories).values(
    DEFAULT_CATEGORIES.map(c => ({ ...c, userId }))
  )
}
