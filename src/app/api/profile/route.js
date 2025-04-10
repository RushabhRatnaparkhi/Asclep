import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Profile from '@/models/Profile';
import User from '@/models/User';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' }, 
        { status: 401 }
      );
    }

    await dbConnect();

    let profile = await Profile.findOne({ userId: decoded.userId });
    
    if (!profile) {
      // If no profile exists, create one with user data
      const user = await User.findById(decoded.userId);
      profile = await Profile.create({
        userId: decoded.userId,
        name: user.name || '',
        email: user.email,
        phone: '',
        dateOfBirth: null,
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        }
      });
    }

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' }, 
        { status: 401 }
      );
    }

    const data = await request.json();
    await dbConnect();

    const profile = await Profile.findOneAndUpdate(
      { userId: decoded.userId },
      data,
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json(profile);

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}