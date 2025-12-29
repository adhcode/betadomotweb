import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Middleware for future use
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/blog',
  ],
};