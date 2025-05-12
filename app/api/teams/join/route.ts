import { db } from '@/database/db';
import { teams, teamMemberships, users } from '@/database/index';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { inviteCode } = await req.json();
  const [team] = await db.select().from(teams).where(eq(teams.inviteCode, inviteCode));
  if (!team) return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 });
  await db.insert(teamMemberships).values({ userId: session.user.id, teamId: team.id });
  await db
    .update(users)
    .set({
      teamId: team.id,
    })
    .where(eq(users.id, session.user.id));

  // return NextResponse.json({ success: true });
  return NextResponse.json({
    message: 'Joined team successfully',
    teamId: team.id,
  });
}
