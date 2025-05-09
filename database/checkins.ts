import { pgTable, uuid, date, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { goals } from './schema/goals';

export const checkins = pgTable('checkins', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  goalId: uuid('goal_id')
    .notNull()
    .references(() => goals.id, { onDelete: 'cascade' }),
  checkInDate: date('check_in_date').notNull().defaultNow(),
  xpEarned: integer('xp_earned').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
