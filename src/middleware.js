import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request) {
  const isPublicPath = request.nextUrl.pathname === '/login' || 
                      request.nextUrl.pathname === '/register' ||
                      request.nextUrl.pathname.startsWith('/api/auth');

  const hasToken = request.cookies.has('token');

  // Allow public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  // No token, redirect to login
  if (!hasToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Has token, allow request
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login
     * - register
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
};