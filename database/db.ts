// database/db.ts
import 'dotenv/config';
import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { WebSocket } from 'ws';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// Configure Neon for WebSockets
neonConfig.webSocketConstructor = WebSocket;

// Create connection pool with SSL
const pool = new Pool({
  connectionString,
  ssl: true, // Ensure SSL is enabled for Neon
});

// Create and export Drizzle instance
export const db = drizzle(pool);
