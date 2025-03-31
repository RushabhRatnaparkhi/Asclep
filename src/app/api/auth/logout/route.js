import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Remove the authentication token
    cookies().delete('token');
    
    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { 
      status: 500 
    });
  }
}