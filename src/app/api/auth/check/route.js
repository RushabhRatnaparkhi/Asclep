import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    
    if (token) {
      const decoded = await verifyAuth(token.value);
      return NextResponse.json({ isAuthenticated: !!decoded?.userId });
    }
  } catch (error) {
    console.error('Auth check failed:', error);
  }
  
  return NextResponse.json({ isAuthenticated: false });
} 