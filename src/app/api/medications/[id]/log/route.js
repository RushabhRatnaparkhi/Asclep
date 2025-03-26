import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';
import MedicationLog from '@/models/MedicationLog';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';

export async function POST(request, context) {
  try {
    await dbConnect();
    const { params } = context;
    
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyAuth(token);
    const userId = decoded.userId;

    const { status, scheduledTime, notes } = await request.json();

    // Validate medication ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid medication ID' },
        { status: 400 }
      );
    }

    // Create medication log
    const log = await MedicationLog.create({
      userId: new mongoose.Types.ObjectId(userId),
      medicationId: new mongoose.Types.ObjectId(params.id),
      status,
      scheduledTime: new Date(scheduledTime),
      takenTime: status === 'taken' ? new Date() : null,
      notes
    });

    // If medication was taken, update remaining pills
    if (status === 'taken') {
      await Medication.findOneAndUpdate(
        { _id: params.id },
        { $inc: { remainingPills: -1 } }
      );
    }

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error('Failed to log medication:', error);
    return NextResponse.json(
      { error: 'Failed to log medication' },
      { status: 500 }
    );
  }
} 