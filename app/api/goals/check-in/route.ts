// app/api/goals/check-in/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authClient } from "@/lib/auth-client";

// Difficulty to XP mapping
const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await authClient.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { goalId } = await req.json();
    
    if (!goalId) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // In a full implementation, you would:
    // 1. Check if the goal exists and belongs to the user
    // 2. Check if already checked in today
    // 3. Create a check-in record in the database
    // 4. Update user XP and streak
    
    // For now, we'll simulate a successful check-in
    // In production, you would store this in your database
    
    // Get the goal details to calculate XP
    const goalsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/goals/my`, {
      headers: {
        Cookie: req.headers.get('cookie') || '',
      },
    });
    
    if (!goalsRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch goal details' }, { status: 500 });
    }
    
    const goalsData = await goalsRes.json();
    const goal = goalsData.goals.find((g: any) => g.id === goalId);
    
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    
    // Calculate XP earned based on difficulty
    const xpEarned = DIFFICULTY_XP[goal.difficulty as keyof typeof DIFFICULTY_XP] || 10;

    // Return success response
    return NextResponse.json({ 
      success: true, 
      checkIn: {
        goalId,
        date: today,
        xpEarned,
      }
    });
  } catch (error) {
    console.error('Error in check-in:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}