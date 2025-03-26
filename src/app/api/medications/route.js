import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';
import { verifyAuth } from '@/lib/auth';

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

    const medications = await Medication.find({ userId })
      .sort({ createdAt: -1 });

    return NextResponse.json({ medications });
  } catch (error) {
    console.error('Failed to fetch medications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const medicationData = await request.json();
    const medication = await Medication.create({
      ...medicationData,
      userId
    });

    return NextResponse.json(medication, { status: 201 });
  } catch (error) {
    console.error('Failed to create medication:', error);
    return NextResponse.json(
      { error: 'Failed to create medication' },
      { status: 500 }
    );
  }
} 