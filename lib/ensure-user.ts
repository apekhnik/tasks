import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { seedDefaultCategories } from '@/lib/seed'

export async function ensureUser() {
  const clerkUser = await currentUser()
  if (!clerkUser) return null

  const existing = await db.select().from(users).where(eq(users.id, clerkUser.id))

  if (existing.length === 0) {
    await db.insert(users).values({
      id:    clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
      name:  `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || null,
    })
    await seedDefaultCategories(clerkUser.id)
  }

  return clerkUser
}
