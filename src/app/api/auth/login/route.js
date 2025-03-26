import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create token with user data
    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    });

    // Create response object first
    const response = NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email
      }
    });

    // Set cookie on the response object
    const cookieStore = await cookies();
    await cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 