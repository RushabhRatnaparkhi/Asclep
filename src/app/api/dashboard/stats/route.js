import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';
import Prescription from '@/models/Prescription';

export async function GET(request) {
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

    const [totalMedications, prescriptions] = await Promise.all([
      Medication.countDocuments({ userId: decoded.userId }),
      Prescription.countDocuments({ userId: decoded.userId })
    ]);

    const now = new Date();
    const activeMedications = await Medication.countDocuments({
      userId: decoded.userId,
      endDate: { $gte: now }
    });

    const upcomingDoses = await Medication.countDocuments({
      userId: decoded.userId,
      nextDoseTime: {
        $gte: now,
        $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) // Next 24 hours
      }
    });

    return NextResponse.json({
      totalMedications,
      activeMedications,
      upcomingDoses,
      prescriptions
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}