import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MedicationLog from '@/models/MedicationLog';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(request, context) {
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

    // Validate medication ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid medication ID' },
        { status: 400 }
      );
    }

    // Get medication logs
    const logs = await MedicationLog.find({
      userId: new mongoose.Types.ObjectId(userId),
      medicationId: new mongoose.Types.ObjectId(params.id)
    })
    .sort({ scheduledTime: -1 });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Failed to fetch medication history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medication history' },
      { status: 500 }
    );
  }
} 