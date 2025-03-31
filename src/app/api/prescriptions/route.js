import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Prescription from '@/models/Prescription';

export async function GET() {
  try {
    const user = await verifyAuth();
    await dbConnect();
    
    const prescriptions = await Prescription.find({ userId: user.userId });
    return NextResponse.json({ prescriptions: prescriptions || [] });
  } catch (error) {
    return NextResponse.json({ 
      error: error.message,
      prescriptions: [] 
    }, { 
      status: error.message === 'Invalid token' ? 401 : 500 
    });
  }
}

export async function POST(request) {
  try {
    const user = await verifyAuth();
    await dbConnect();

    const formData = await request.formData();
    let prescriptionData = {};
    let imageUrl = null;

    // Handle image upload if present
    const imageFile = formData.get('image');
    if (imageFile) {
      const response = await fetch(process.env.CLOUDINARY_UPLOAD_URL, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      imageUrl = data.secure_url;
    }

    // Get other form fields
    prescriptionData = {
      userId: user.userId,
      medication: formData.get('medication'),
      dosage: formData.get('dosage'),
      frequency: formData.get('frequency'),
      startDate: formData.get('startDate'),
      instructions: formData.get('instructions'),
      prescribedBy: formData.get('prescribedBy'),
    };

    if (imageUrl) {
      prescriptionData.imageUrl = imageUrl;
    }

    const prescription = await Prescription.create(prescriptionData);
    return NextResponse.json(prescription, { status: 201 });
  } catch (error) {
    console.error('Failed to create prescription:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create prescription' },
      { status: 500 }
    );
  }
}