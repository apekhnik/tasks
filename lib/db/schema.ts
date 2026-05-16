import { pgTable, serial, text, boolean, timestamp, integer, pgEnum } from 'drizzle-orm/pg-core'

export const priorityEnum = pgEnum('priority', ['HIGH', 'MEDIUM', 'LOW'])
export const difficultyEnum = pgEnum('difficulty', ['EASY', 'MEDIUM', 'HARD'])

export const users = pgTable('users', {
  id:        text('id').primaryKey(),
  email:     text('email').unique().notNull(),
  name:      text('name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const categories = pgTable('categories', {
  id:        serial('id').primaryKey(),
  name:      text('name').notNull(),
  icon:      text('icon').notNull(),
  color:     text('color').notNull(),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tasks = pgTable('tasks', {
  id:          serial('id').primaryKey(),
  title:       text('title').notNull(),
  description: text('description'),
  priority:    priorityEnum('priority').notNull().default('LOW'),
  difficulty:  difficultyEnum('difficulty').notNull().default('EASY'),
  categoryId:  integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  completed:   boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  userId:      text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type Category = typeof categories.$inferSelect
export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert
export type NewCategory = typeof categories.$inferInsert
