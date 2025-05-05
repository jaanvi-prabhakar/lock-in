import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

import { db } from "@/database/db"
import * as schema from "@/database/index"
import { admin } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
        // schema  // this one can't be resolved until Neon is setup and we run pnpm auth:generate 
    }),
    session: {
        cookieCache: {
            enabled: true,
            // Cache duration in seconds.
            // set to 5 mins for development; 
            // could be a week or longer in production

            maxAge: 5 * 60 
        },
        extend: {
            user: {
              role: true,
            },
          },

    },
    emailAndPassword: {
        enabled: true
    },

    plugins: [
        nextCookies(), // keep this last in `plugins` array
        admin() 
    ]
})
