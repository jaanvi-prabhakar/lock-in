import { pgTable, uuid, varchar, integer, timestamp } from 'drizzle-orm/pg-core';

export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  inviteCode: varchar('invite_code', { length: 64 }).notNull().unique(),
  totalXP: integer('total_xp').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
