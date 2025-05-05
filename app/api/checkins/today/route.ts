import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/database/db";
import { checkins } from "@/database/index";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const today = new Date().toISOString().split('T')[0]; // only take the day YYYY-MM-DD

    const results = await db
        .select()
        .from(checkins)
        .where(
            and(
                eq(checkins.userId, userId),
                eq(checkins.checkInDate, today)
            )
        );

    return NextResponse.json(results);
}