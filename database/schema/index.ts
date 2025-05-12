// database/schema/index.ts
import { pgTable, text, timestamp, boolean, serial } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Convert todos to use PostgreSQL instead of SQLite
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  completed: boolean('completed').notNull().default(false),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  inviteCode: text('invite_code').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  teamId: serial('team_id')
    .references(() => teams.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id').notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export type Todo = typeof todos.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;

// Export all schemas
export * from './auth';
export * from '@/database/schema/goals';
