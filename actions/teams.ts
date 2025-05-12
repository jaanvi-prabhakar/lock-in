'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { eq, and } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/database/db';
import { teams, teamMembers } from '@/database/schema';

const createTeamSchema = z.object({
  teamName: z.string().min(1, 'Team name cannot be empty'),
});

const joinTeamSchema = z.object({
  teamCode: z.string().min(6, 'Invalid team code'),
});

export async function createTeam(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) return { error: 'Unauthorized' };

  const teamName = formData.get('teamName') as string;
  const validation = createTeamSchema.safeParse({ teamName });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const inviteCode = nanoid(10);

  const [team] = await db
    .insert(teams)
    .values({
      name: teamName,
      inviteCode,
    })
    .returning();

  // Add creator as team member
  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: session.user.id,
  });

  revalidatePath('/teams');
  return { error: '', inviteCode };
}

export async function joinTeam(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) return { error: 'Unauthorized' };

  const teamCode = formData.get('teamCode') as string;
  const validation = joinTeamSchema.safeParse({ teamCode });

  if (!validation.success) {
    return { error: validation.error.errors[0].message };
  }

  const team = await db.query.teams.findFirst({
    where: eq(teams.inviteCode, teamCode),
  });

  if (!team) {
    return { error: 'Invalid team code' };
  }

  // Check if already a member
  const existingMember = await db.query.teamMembers.findFirst({
    where: and(eq(teamMembers.teamId, team.id), eq(teamMembers.userId, session.user.id)),
  });

  if (existingMember) {
    return { error: 'You are already a member of this team' };
  }

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: session.user.id,
  });

  revalidatePath('/teams');
  return { error: '' };
}
