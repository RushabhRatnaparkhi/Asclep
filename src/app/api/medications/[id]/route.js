import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';

export async function DELETE(request, context) {
  try {
    const id = context.params.id;  // Access id directly from context
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

    await medication.deleteOne();

    return NextResponse.json(
      { message: 'Medication deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete medication error:', error);
    return NextResponse.json(
      { error: 'Failed to delete medication' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
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

    const medication = await Medication.findOne({
      _id: params.id,
      userId: decoded.userId
    });

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(medication);

  } catch (error) {
    console.error('Get medication error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medication' },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
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

    const data = await request.json();
    
    // Calculate next dose time
    const startDateTime = new Date(data.startDate);
    const [hours, minutes] = data.firstDoseTime.split(':');
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const updateData = {
      ...data,
      dosageTime: data.firstDoseTime,
      nextDoseTime: startDateTime,
      userId: decoded.userId
    };

    const medication = await Medication.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(medication);

  } catch (error) {
    console.error('Update medication error:', error);
    return NextResponse.json(
      { error: 'Failed to update medication' },
      { status: 500 }
    );
  }
}