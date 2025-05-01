import { db } from '@/database/db';
import { teams, teamMemberships } from '@/database/index';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // to be debugged
    const result = await db.query.teams.findFirst({
        where: (teams, { eq }) => eq(teams.id, teamMemberships.teamId),
        with: {
            members: true
        }
    });
  
    return NextResponse.json(result);
}