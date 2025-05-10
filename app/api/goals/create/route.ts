// app/api/goals/create/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authClient } from "@/lib/auth-client";

export async function POST(req: NextRequest) {
  try {
    // Check authentication using authClient
    const session = await authClient.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { title, description, difficulty, timeEstimate } = await req.json();
    
    // Validate required fields
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    
    // Create a goal object with a generated ID
    // In a real implementation, you would save this to your database
    const goal = {
      id: `goal-${Date.now()}`,
      title,
      description: description || '',
      difficulty: difficulty || 'medium',
      timeEstimate: timeEstimate ? parseInt(timeEstimate.toString()) : 30,
      userId: session.user?.id,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // If you have a direct way to create goals in your database, use that instead
    // For example, if you're using Prisma:
    // const goal = await prisma.goal.create({
    //   data: {
    //     title,
    //     description: description || '',
    //     difficulty: difficulty || 'medium',
    //     timeEstimate: timeEstimate ? parseInt(timeEstimate.toString()) : 30,
    //     userId: session.user.id,
    //   },
    // });

    return NextResponse.json({ goal });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}