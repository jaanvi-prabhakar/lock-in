import { pgTable, uuid, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { teams } from './teams';

export const teamMemberships = pgTable('teamMemberships', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  teamId: uuid('teamid')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  joinedAt: timestamp('joinedAt').defaultNow().notNull(),
});
