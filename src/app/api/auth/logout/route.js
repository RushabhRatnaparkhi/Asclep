import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Create the response
    const response = NextResponse.json({ success: true });
    
    // Clear the token cookie
    const cookieStore = await cookies();
    await cookieStore.delete('token');
    
    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
} 