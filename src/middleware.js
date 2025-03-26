import { NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')

  // Paths that don't require authentication
  const publicPaths = ['/login', '/register']
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname)
  
  try {
    if (!token && !isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (token && isPublicPath) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // If token verification fails, redirect to login
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/medications/:path*',
    '/profile/:path*',
    '/history/:path*'
  ],
} 