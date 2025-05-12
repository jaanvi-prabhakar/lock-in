import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextResponse } from 'next/server';

const handler = toNextJsHandler(auth);

export async function GET(req: Request) {
  try {
    return await handler.GET(req);
  } catch (error) {
    console.error('Auth GET Error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.clone().json();
    console.log('Auth POST Request Body:', body);
    const response = await handler.POST(req);
    return response;
  } catch (error: any) {
    console.error('Auth POST Error:', {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      cause: error?.cause,
    });
    return NextResponse.json(
      {
        error: 'Authentication failed',
        details: error?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
