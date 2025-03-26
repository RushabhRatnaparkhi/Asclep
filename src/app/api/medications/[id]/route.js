import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';
import { verifyAuth } from '@/lib/auth';
import mongoose from 'mongoose';

export async function DELETE(request, context) {
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

    // Convert string ID to MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid medication ID' },
        { status: 400 }
      );
    }

    const medication = await Medication.findOne({
      _id: new mongoose.Types.ObjectId(params.id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      );
    }

    await medication.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete medication:', error);
    return NextResponse.json(
      { error: 'Failed to delete medication' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, context) {
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

    const updateData = await request.json();
    
    const medication = await Medication.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(params.id),
        userId: new mongoose.Types.ObjectId(userId)
      },
      { $set: updateData },
      { new: true }
    );

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ medication });
  } catch (error) {
    console.error('Failed to update medication:', error);
    
    // More specific error handling
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Invalid medication data' },
        { status: 400 }
      );
    }
    
    if (error.code === 'ECONNRESET') {
      return NextResponse.json(
        { error: 'Database connection error. Please try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update medication' },
      { status: 500 }
    );
  }
}

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

    const medication = await Medication.findOne({
      _id: new mongoose.Types.ObjectId(params.id),
      userId: new mongoose.Types.ObjectId(userId)
    });

    if (!medication) {
      return NextResponse.json(
        { error: 'Medication not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ medication });
  } catch (error) {
    console.error('Failed to fetch medication:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medication' },
      { status: 500 }
    );
  }
} 