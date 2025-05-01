import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/database/db";
import { users } from "@/database/index";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    return NextResponse.json(user[0]);
}