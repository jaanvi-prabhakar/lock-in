import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextResponse } from "next/server"

const handler = toNextJsHandler(auth)

export async function GET(req: Request) {
    try {
        return await handler.GET(req)
    } catch (error) {
        console.error('Auth GET Error:', error)
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        return await handler.POST(req)
    } catch (error) {
        console.error('Auth POST Error:', error)
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
} 