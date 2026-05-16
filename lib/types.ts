import type { Task, Category } from '@/lib/db/schema'
export type TaskWithCategory = Task & { category: Category | null }
