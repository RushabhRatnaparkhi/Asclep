import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await verifyAuth();
    return NextResponse.json({ 
      authenticated: true, 
      user,
      message: 'Authentication successful'
    });
  } catch (error) {
    console.error('Auth check failed:', error);
    return NextResponse.json({ 
      authenticated: false, 
      error: error.message 
    }, { 
      status: 401 
    });
  }
}