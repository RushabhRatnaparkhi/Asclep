import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  try {
    const user = await verifyAuth();
    await dbConnect();

    const subscription = await request.json();
    
    // Update user's push subscription
    await User.findByIdAndUpdate(user.userId, {
      pushSubscription: subscription
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}