import { db } from '@/database/db';
import { users, teams } from '@/database/index';
import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';

// Helper function to get user leaderboard
async function getUserLeaderboard(limit = 10) {
  const topUsers = await db
    .select({
      id: users.id,
      name: users.name,
      currentXP: users.currentXP,
      level: users.level,
    })
    .from(users)
    .orderBy(desc(users.currentXP))
    .limit(limit);

  return topUsers;
}

// Helper function to get team leaderboard
async function getTeamLeaderboard(limit = 10) {
  const topTeams = await db
    .select({
      id: teams.id,
      name: teams.name,
      totalXP: teams.totalXP,
    })
    .from(teams)
    .orderBy(desc(teams.totalXP))
    .limit(limit);

  return topTeams;
}

// Main handler
// Example usage: GET /api/leaderboard?type=teams&limit=5 (top 5 teams)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'users'; // 'users' or 'teams'
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    if (type === 'teams') {
      const leaderboard = await getTeamLeaderboard(limit);
      return NextResponse.json({ leaderboard, type: 'teams' });
    } else {
      const leaderboard = await getUserLeaderboard(limit);
      return NextResponse.json({ leaderboard, type: 'users' });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
