import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request) {
  // Define public and protected paths
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // Get token from cookies
  const token = request.cookies.get('token')?.value;

  // Redirect to login if accessing protected route without token
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if accessing public route with valid token
  if (isPublicPath && token) {
    try {
      const isValidToken = await verifyToken(token);
      if (isValidToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};