import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/database/db";
import { goals } from '@/database/schema/goals';
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { goalId, completed } = await request.json();

    if (!goalId) {
      return NextResponse.json({ error: "Goal ID is required" }, { status: 400 });
    }

    // First check if the goal belongs to the user
    const goal = await db.query.goals.findFirst({
      where: eq(goals.id, goalId),
    });

    if (!goal || goal.userId !== session.user.id) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    // Update the goal
    await db
      .update(goals)
      .set({ completed })
      .where(eq(goals.id, goalId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling goal:", error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
} 