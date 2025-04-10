import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();

    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);

    const medications = await Medication.find({
      userId: decoded.userId,
      nextDoseTime: {
        $gte: now,
        $lte: fiveMinutesFromNow
      },
      status: 'active'
    }).sort({ nextDoseTime: 1 });

    return NextResponse.json(medications);

  } catch (error) {
    console.error('Upcoming medications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming medications' },
      { status: 500 }
    );
  }
}