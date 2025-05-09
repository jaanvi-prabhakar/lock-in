import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config()

// Use the Neon database URL
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set")
}

export default {
  schema: "./database/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: databaseUrl,
  },
} satisfies Config