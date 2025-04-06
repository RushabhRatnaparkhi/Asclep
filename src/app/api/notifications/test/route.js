import { NextResponse } from 'next/server';
import webpush from 'web-push';
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
    if (!userData?.pushSubscription?.endpoint) {
      return NextResponse.json(
        { error: 'Notifications not enabled for this user' },
        { status: 400 }
      );
    }

    // Format subscription data for webpush
    const subscription = {
      endpoint: userData.pushSubscription.endpoint,
      keys: {
        p256dh: userData.pushSubscription.keys.p256dh,
        auth: userData.pushSubscription.keys.auth
      }
    };

    // Configure webpush
    webpush.setVapidDetails(
      'mailto:your-email@example.com', // Replace with your email
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const testPayload = {
      title: 'Medication Reminder',
      body: 'This is a test notification!',
      icon: '/next.svg',
      timestamp: new Date().getTime()
    };

    // Send the notification
    await webpush.sendNotification(
      subscription,
      JSON.stringify(testPayload)
    );

    return NextResponse.json({ 
      success: true,
      message: 'Test notification sent successfully'
    });

  } catch (error) {
    console.error('Test notification error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test notification',
        details: error.message
      },
      { status: 500 }
    );
  }
}