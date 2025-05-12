// app/api/goals/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authClient } from '@/lib/auth-client';

// Difficulty to XP mapping
const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
};

// Default stats with zero values
const DEFAULT_STATS = {
  totalXP: 0,
  streak: 0,
  todayXP: 0,
  weeklyXP: [0, 0, 0, 0, 0, 0, 0], // All zeros for Mon-Sun
};

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await authClient.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get base URL for API requests
    // Try to use window.location.origin first, fallback to env var or request origin
    const baseUrl = req.nextUrl?.origin || process.env.NEXT_PUBLIC_BASE_URL || '';

    // Fetch goals from your existing endpoint
    const goalsRes = await fetch(`${baseUrl}/api/goals/my`, {
      headers: {
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!goalsRes.ok) {
      const error = await goalsRes.json();
      return NextResponse.json(
        { error: error.error || 'Failed to fetch goals' },
        { status: goalsRes.status }
      );
    }

    const goalsData = await goalsRes.json();

    // Add checkedInToday property to each goal
    // In a real app, this would come from your database
    const goalsWithCheckInStatus = (goalsData.goals || []).map((goal: any) => ({
      ...goal,
      checkedInToday: false, // Default to false - in production this would come from DB
    }));

    // In a real implementation, you would:
    // 1. Fetch user stats from your database
    // 2. Calculate streak based on check-in history
    // 3. Calculate today's XP based on today's check-ins
    // 4. Calculate weekly XP based on the last 7 days of check-ins

    // For now, use the default zero values
    const userStats = { ...DEFAULT_STATS };

    return NextResponse.json({
      goals: goalsWithCheckInStatus,
      stats: userStats,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
