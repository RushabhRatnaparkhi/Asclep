import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MedicationLog from '@/models/MedicationLog';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = user.userId;

    // Get recent medication logs with medication details
    const recentLogs = await MedicationLog.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'medications',
          localField: 'medicationId',
          foreignField: '_id',
          as: 'medication'
        }
      },
      {
        $unwind: '$medication'
      },
      {
        $project: {
          type: { $literal: 'medication' },
          status: 1,
          medicationName: '$medication.name',
          timestamp: '$createdAt',
          notes: 1
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return NextResponse.json({ activities: recentLogs });
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}