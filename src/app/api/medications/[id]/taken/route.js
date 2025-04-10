import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';

export async function POST(request, { params }) {
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

    const medication = await Medication.findOne({
      _id: params.id,
      userId: decoded.userId
    });

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      );
    }

    // Calculate next dose time based on frequency
    const nextDoseTime = calculateNextDoseTime(medication);
    
    medication.nextDoseTime = nextDoseTime;
    await medication.save();

    return NextResponse.json({ message: 'Medication marked as taken' });

  } catch (error) {
    console.error('Update medication error:', error);
    return NextResponse.json(
      { error: 'Failed to update medication' },
      { status: 500 }
    );
  }
}

function calculateNextDoseTime(medication) {
  const now = new Date();
  const frequency = medication.frequency;

  switch (frequency) {
    case 'once-daily':
      return new Date(now.setHours(now.getHours() + 24));
    case 'twice-daily':
      return new Date(now.setHours(now.getHours() + 12));
    case 'three-daily':
      return new Date(now.setHours(now.getHours() + 8));
    case 'four-daily':
      return new Date(now.setHours(now.getHours() + 6));
    case 'once-weekly':
      return new Date(now.setDate(now.getDate() + 7));
    case 'twice-weekly':
      return new Date(now.setDate(now.getDate() + 3));
    case 'three-weekly':
      return new Date(now.setDate(now.getDate() + 2));
    case 'once-monthly':
      return new Date(now.setMonth(now.getMonth() + 1));
    case 'twice-monthly':
      return new Date(now.setDate(now.getDate() + 15));
    case 'every-other-day':
      return new Date(now.setDate(now.getDate() + 2));
    default:
      return new Date(now.setHours(now.getHours() + 24));
  }
}