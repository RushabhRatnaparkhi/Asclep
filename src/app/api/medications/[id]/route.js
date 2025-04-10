import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';

export async function DELETE(request, { params }) {
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