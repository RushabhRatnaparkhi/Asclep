import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';
import MedicationLog from '@/models/MedicationLog';
import Appointment from '@/models/Appointment';

export async function GET(request) {
  try {
    await dbConnect();

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

    // Get today's date boundaries
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get medications due today
    const dueTodayCount = await Medication.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      startDate: { $lte: tomorrow },
      $or: [
        { endDate: { $gte: today } },
        { endDate: null }
      ]
    });

    // Get medications running low (less than 7 days supply)
    const lowMedicationCount = await Medication.countDocuments({
      userId: new mongoose.Types.ObjectId(userId),
      remainingPills: { $lte: 7 }
    });

    // Calculate adherence rate
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const logs = await MedicationLog.find({
      userId: new mongoose.Types.ObjectId(userId),
      scheduledTime: { $gte: thirtyDaysAgo }
    });

    const totalScheduled = logs.length;
    const takenCount = logs.filter(log => log.status === 'taken').length;
    const adherenceRate = totalScheduled > 0 
      ? Math.round((takenCount / totalScheduled) * 100)
      : 100;

    // Get next appointment
    const nextAppointment = await Appointment.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gt: new Date() }
    })
    .sort({ date: 1 });

    return NextResponse.json({
      dueTodayCount,
      lowMedicationCount,
      adherenceRate,
      nextAppointment: nextAppointment?.date
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 