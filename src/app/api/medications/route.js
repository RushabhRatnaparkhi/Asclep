import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';

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

    const medications = await Medication.find({ 
      userId: decoded.userId 
    }).sort({ 
      nextDoseTime: 1 
    });

    return NextResponse.json(medications);

  } catch (error) {
    console.error('Medications API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medications' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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

    const data = await request.json();
    
    // Validate required fields
    if (!data.dosageTime || !data.nextDoseTime) {
      return NextResponse.json(
        { error: 'Missing required fields: dosageTime and nextDoseTime' },
        { status: 400 }
      );
    }

    const medication = await Medication.create({
      ...data,
      userId: decoded.userId
    });

    return NextResponse.json(medication, { status: 201 });

  } catch (error) {
    console.error('Create medication error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create medication' },
      { status: 500 }
    );
  }
}