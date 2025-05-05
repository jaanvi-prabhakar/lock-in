import { db } from '@/database/db';
import { teams, teamMemberships, users } from '@/database/index';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

// Generate a random and unique invite code
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_@!?';
const MAX_RETRIES = 5;

function generateRandomCode(length = 8): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }
    return result;
}

// generate code and avoid collision
async function generateInviteCode(): Promise<string> {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        const code = generateRandomCode();
        const existing = await db
          .select()
          .from(teams)
          .where(eq(teams.inviteCode, code));
        if (existing.length === 0) {
          return code;
        }
    }
    throw new Error('Failed to generate a unique invite code after several attempts.');
}

  
export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();
    const inviteCode = await generateInviteCode();
    const [team] = await db.insert(teams).values({ name, inviteCode }).returning();
    await db.insert(teamMemberships).values({ userId: session.user.id, teamId: team.id });
    await db.update(users).set({
        teamId: team.id,
      }).where(eq(users.id, session.user.id));

    return NextResponse.json({ team });
}