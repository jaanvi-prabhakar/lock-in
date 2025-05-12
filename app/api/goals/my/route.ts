import { auth } from '@/lib/auth';
import { db } from '@/database/db';
import { goals } from '@/database/schema/goals';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const GET = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userGoals = await db.select().from(goals).where(eq(goals.userId, session.user.id));

    return NextResponse.json({ goals: userGoals }, { status: 200 });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
};
