import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const user = await verifyAuth();
    
    if (!user) {
      return NextResponse.json({ 
        authenticated: false 
      }, { 
        status: 401 
      });
    }

    return NextResponse.json({ 
      authenticated: true,
      user
    });
  } catch (error) {
    return NextResponse.json({ 
      authenticated: false,
      error: error.message 
    }, { 
      status: 401 
    });
  }
}