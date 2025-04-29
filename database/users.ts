import { pgTable, uuid, varchar, integer, timestamp, date } from 'drizzle-orm/pg-core';
import { teams } from './teams';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  image: varchar('image', { length: 512 }),
  currentXP: integer('current_xp').default(0),
  level: integer('level').default(1),
  streakCount: integer('streak_count').default(0),
  lastCheckInDate: date('last_check_in_date'),
  teamId: uuid('teams.id').references(() => teams.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
