import { sql } from "drizzle-orm"
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core"
import { pgTable, timestamp, serial } from "drizzle-orm/pg-core"

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  userId: text("user_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: serial("team_id").references(() => teams.id, { onDelete: "cascade" }).notNull(),
  userId: text("user_id").notNull(),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
})

export type Todo = typeof todos.$inferSelect
export type Team = typeof teams.$inferSelect
export type TeamMember = typeof teamMembers.$inferSelect 