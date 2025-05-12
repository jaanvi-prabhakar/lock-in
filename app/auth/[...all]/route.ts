// In auth/route.ts
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest } from 'next/server';

// Create a handler with error handling
const originalHandler = toNextJsHandler(auth);

// Custom POST handler with error logging and correct types
export async function POST(req: NextRequest) {
  try {
    // Call the original handler
    return await originalHandler.POST(req);
  } catch (error: any) {
    // Log detailed error information
    console.error('Auth error details:', error);
    console.error('Error stack:', error.stack);

    // Return a more helpful error response
    return Response.json(
      {
        error: error.message || 'Unknown error',
        stack: error.stack || 'No stack trace',
      },
      { status: 500 }
    );
  }
}

// Keep the original GET handler
export const GET = originalHandler.GET;
