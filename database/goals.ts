import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
  boolean,
  text,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);

export const goals = pgTable('goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description'),
  difficulty: difficultyEnum('difficulty').notNull(),
  timeEstimate: integer('time_estimate').default(30), // in mins
  createdAt: timestamp('created_at').defaultNow().notNull(),
  isArchived: boolean('is_archived').default(false),
});
