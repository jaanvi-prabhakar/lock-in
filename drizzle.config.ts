import type { Config } from "drizzle-kit"
import "dotenv/config"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export default {
  schema: "./database/schema/*",
  out: "./database/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config
