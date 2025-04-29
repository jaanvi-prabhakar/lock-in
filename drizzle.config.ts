import "dotenv/config"
import { defineConfig } from "drizzle-kit";

// If we need both a local and a production URL
// const url = process.env.NODE_ENV == 'production' ? process.env.DATABASE_URL : process.env.LOCAL_DATABASE_URL;
const url = process.env.DATABASE_URL;

if(!url) 
    throw new Error(`Database URL not found.`);
    // throw new Error(
    //     `Connection string to ${process.env.NODE_ENV ? 'Neon': 'local'} Postgres not found.`
    // );
    
export default defineConfig({
    schema: "./database",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: { url },
});