import { db } from '@/database/db';
import { goals } from '@/database/goals';
import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { headers } from "next/headers"

export async function POST(req: Request) {
    // const session = await auth.api.getSession({
    //     headers: await headers()
    // })
    // if (!session || !session.user?.id) {
    //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();
    const { title, description, difficulty, timeEstimate } = body;
    // TODO: add logic for difficulty computation

    if (!title || !difficulty) {
        return NextResponse.json(
        { error: 'Missing required fields: title or difficulty' },
        { status: 400 }
        );
    }

    try {
        const [goal] = await db
        .insert(goals)
        .values({
            userId: session.user.id,
            title,
            description,
            difficulty,
            timeEstimate: timeEstimate ?? 30,
        })
        .returning();

        return NextResponse.json({ goal }, { status: 201 });
    } catch (err) {
        console.error('[GOAL_CREATE_ERROR]', err);
        return NextResponse.json(
        { error: 'Something went wrong' },
        { status: 500 }
        );
    }
}
