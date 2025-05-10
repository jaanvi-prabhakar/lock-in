// app/api/goals/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authClient } from "@/lib/auth-client";

// Difficulty to XP mapping
const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await authClient.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch goals from your existing endpoint
    const goalsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/goals/my`, {
      headers: {
        Cookie: req.headers.get('cookie') || '',
      },
    });
    
    if (!goalsRes.ok) {
      const error = await goalsRes.json();
      return NextResponse.json({ error: error.error || 'Failed to fetch goals' }, { status: goalsRes.status });
    }

    const goalsData = await goalsRes.json();
    
    // Simulate check-in status (in a real app, you'd get this from a database)
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // For this demo, we'll just mark all goals as not checked in yet
    // In a real app, you'd fetch this from your database
    const goalsWithCheckInStatus = (goalsData.goals || []).map((goal: any) => ({
      ...goal,
      checkedInToday: false, // Default to false - in production this would come from DB
    }));

    // Mock user stats - in a real app, you'd get this from your database
    const userStats = {
      totalXP: 1220,
      streak: 7,
      todayXP: 0,
      weeklyXP: [40, 60, 80, 30, 90, 70, 50], // Example data
    };

    return NextResponse.json({
      goals: goalsWithCheckInStatus,
      stats: userStats,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}