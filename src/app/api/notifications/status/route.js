import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userData = await User.findById(user.userId);
    
    const isSubscribed = !!(userData?.pushSubscription?.endpoint);

    return NextResponse.json({ isSubscribed });
  } catch (error) {
    console.error('Failed to check notification status:', error);
    return NextResponse.json(
      { error: 'Failed to check notification status' },
      { status: 500 }
    );
  }
}