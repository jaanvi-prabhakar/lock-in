import { auth } from "@/lib/auth";
import { db } from "@/database/db";
import { checkins, goals } from "@/database/index";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { eq } from 'drizzle-orm';

// Base XP per minute multiplier by difficulty
const difficultyMultiplier = {
    easy: 0.01,
    medium: 0.02,
    hard: 0.03
};
  
// XP = (minutes since creation) * multiplier
const minutesSinceCreated = (createdAt: Date) =>
    Math.max(1, Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60)));
  
const calculateXP = (difficulty: "easy" | "medium" | "hard", createdAt: Date) => {
    const multiplier = difficultyMultiplier[difficulty];
    const minutes = minutesSinceCreated(createdAt);
    return Math.round(minutes * multiplier);
};

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Prevent multiple check-ins for the same goal on the same day
    const today = new Date().toISOString().split('T')[0]; // only take the day YYYY-MM-DD
    const existing = await db.query.checkins.findFirst({
      where: (c) => eq(c.userId, session.user.id) && eq(c.goalId, goalId) && eq(c.checkInDate, today)
    });
    if (existing) {
      return NextResponse.json({ message: 'Already checked in today.' }, { status: 409 });
    }
  
    const { goalId } = await req.json();
    if (!goalId) {
        return NextResponse.json({ error: "Missing goalId" }, { status: 400 });
    }
    
    const [goal] = await db.select().from(goals).where(eq(goals.id, goalId)).limit(1);
    if (!goal) {
        return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const xpEarned = calculateXP(goal.difficulty, goal.createdAt);

    const [checkin] = await db.insert(checkins).values({
        userId: session.user.id,
        goalId,
        xpEarned
    }).returning();
  
    return NextResponse.json({ checkin, xpEarned }, { status: 201 });
  }