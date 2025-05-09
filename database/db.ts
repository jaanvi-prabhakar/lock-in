import "dotenv/config"
import { neonConfig, Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { WebSocket } from 'ws'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

neonConfig.webSocketConstructor = WebSocket

const pool = new Pool({ connectionString })
export const db = drizzle(pool) 