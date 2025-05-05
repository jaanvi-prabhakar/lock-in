import "dotenv/config"

import { neonConfig, Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { WebSocket } from 'ws';

// import * as schema from './schema'; // this one can't be resolved until Neon is setup and we run pnpm auth:generate 

const connectionString =
  process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.LOCAL_DATABASE_URL;

if (process.env.NODE_ENV === 'production') {
  neonConfig.webSocketConstructor = WebSocket;
  neonConfig.poolQueryViaFetch = true;
} else {
  neonConfig.wsProxy = (host) => `${host}:5433/v1`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.pipelineTLS = false;
  neonConfig.pipelineConnect = false;
}

const pool = new Pool({ connectionString });

export const db = drizzle(pool, { schema }); // this one can't be resolved until Neon is setup and we run pnpm auth:generate 