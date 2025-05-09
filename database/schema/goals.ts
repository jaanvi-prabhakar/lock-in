import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const goals = pgTable("goals", {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  completed: boolean('completed').notNull().default(false),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export type Goal = typeof goals.$inferSelect;