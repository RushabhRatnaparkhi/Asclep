import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';

export async function POST(request) {
  try {
    const user = await verifyAuth();
    await dbConnect();

    const data = await request.json();
    const medicationData = {
      ...data,
      userId: user.userId,
      startDate: data.startDate || new Date(), // Default to current date if not provided
    };

    const medication = await Medication.create(medicationData);
    return NextResponse.json(medication, { status: 201 });
  } catch (error) {
    console.error('Failed to create medication:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create medication' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = user.userId;

    const medications = await Medication.find({ userId });
    return NextResponse.json({ medications });

  } catch (error) {
    console.error('Medications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    );
  }
}