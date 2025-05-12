import { db } from '@/database/db';
import { teams, teamMemberships, users } from '@/database/index';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

// team dashboard
// Return user's team info: members, team XP, team streak

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user's teamId
  const user = await db
    .select({ teamId: users.teamId })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const teamId = user[0]?.teamId;
  if (!teamId) return null; // User has no team

  // Fetch the team info using teamId
  const team = await db.select().from(teams).where(eq(teams.id, teamId)).limit(1);

  return team[0] || null;
}
