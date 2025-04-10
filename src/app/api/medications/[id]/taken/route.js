import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';

export async function POST(request, context) {
  try {
    const id = context.params.id;
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
      _id: id,
      userId: decoded.userId
    });

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      );
    }

    // Calculate next dose time based on frequency
    const now = new Date();
    let nextDoseTime;

    switch (medication.frequency) {
      case 'once-daily':
        nextDoseTime = new Date(now.setHours(now.getHours() + 24));
        break;
      case 'twice-daily':
        nextDoseTime = new Date(now.setHours(now.getHours() + 12));
        break;
      case 'three-daily':
        nextDoseTime = new Date(now.setHours(now.getHours() + 8));
        break;
      case 'four-daily':
        nextDoseTime = new Date(now.setHours(now.getHours() + 6));
        break;
      case 'once-weekly':
        nextDoseTime = new Date(now.setDate(now.getDate() + 7));
        break;
      case 'twice-weekly':
        nextDoseTime = new Date(now.setDate(now.getDate() + 3));
        break;
      case 'three-weekly':
        nextDoseTime = new Date(now.setDate(now.getDate() + 2));
        break;
      case 'once-monthly':
        nextDoseTime = new Date(now.setMonth(now.getMonth() + 1));
        break;
      case 'twice-monthly':
        nextDoseTime = new Date(now.setDate(now.getDate() + 15));
        break;
      case 'every-other-day':
        nextDoseTime = new Date(now.setDate(now.getDate() + 2));
        break;
      default:
        nextDoseTime = new Date(now.setHours(now.getHours() + 24));
    }

    // Set time component of nextDoseTime to match original dosageTime
    const [hours, minutes] = medication.dosageTime.split(':');
    nextDoseTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    medication.nextDoseTime = nextDoseTime;
    await medication.save();

    // Return complete medication data
    return NextResponse.json({ 
      success: true,
      medication: {
        ...medication.toObject(),
        nextDoseTime: nextDoseTime
      }
    });

  } catch (error) {
    console.error('Update medication error:', error);
    return NextResponse.json(
      { error: 'Failed to update medication' },
      { status: 500 }
    );
  }
}