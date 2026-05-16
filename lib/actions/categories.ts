'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function createCategory(data: { name: string; icon: string; color: string }) {
  const userId = await getUserId()
  await db.insert(categories).values({ name: data.name, icon: data.icon, color: data.color, userId })
  revalidatePath('/dashboard', 'layout')
}

export async function deleteCategory(id: number) {
  const userId = await getUserId()
  await db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, userId)))
  revalidatePath('/dashboard', 'layout')
}
