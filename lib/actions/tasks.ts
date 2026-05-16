'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { tasks } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import type { Priority, Difficulty } from '@/lib/constants'

interface TaskFormData {
  title: string; description?: string | null
  priority: Priority; difficulty: Difficulty; categoryId?: number | null
}

async function getUserId() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  return userId
}

export async function createTask(data: TaskFormData) {
  const userId = await getUserId()
  await db.insert(tasks).values({
    title:       data.title,
    description: data.description ?? null,
    priority:    data.priority,
    difficulty:  data.difficulty,
    categoryId:  data.categoryId ?? null,
    userId,
  })
  revalidatePath('/dashboard', 'layout')
}

export async function updateTask(id: number, data: Partial<TaskFormData>) {
  const userId = await getUserId()
  await db.update(tasks)
    .set({
      title:       data.title,
      description: data.description ?? null,
      priority:    data.priority,
      difficulty:  data.difficulty,
      categoryId:  data.categoryId ?? null,
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
  revalidatePath('/dashboard', 'layout')
}

export async function deleteTask(id: number) {
  const userId = await getUserId()
  await db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
  revalidatePath('/dashboard', 'layout')
}

export async function completeTask(id: number) {
  const userId = await getUserId()
  await db.update(tasks)
    .set({ completed: true, completedAt: new Date() })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
  revalidatePath('/dashboard', 'layout')
}

export async function uncompleteTask(id: number) {
  const userId = await getUserId()
  await db.update(tasks)
    .set({ completed: false, completedAt: null })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
  revalidatePath('/dashboard', 'layout')
}
