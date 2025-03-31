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
    await dbConnect();
    
    const medications = await Medication.find({ userId: user.userId });
    return NextResponse.json({ medications });
  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      medications: [] 
    }, { 
      status: error.message === 'Invalid token' ? 401 : 500 
    });
  }
}