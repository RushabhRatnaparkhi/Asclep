import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Medication from '@/models/Medication';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    const prescription = await Medication.findOne({
      _id: params.id,
      userId: decoded.userId,
      'prescriptionFile.url': { $exists: true }
    });

    if (!prescription) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    // Delete file from Cloudinary
    if (prescription.prescriptionFile?.url) {
      const publicId = prescription.prescriptionFile.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await prescription.deleteOne();

    return NextResponse.json(
      { message: 'Prescription deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Delete prescription error:', error);
    return NextResponse.json(
      { error: 'Failed to delete prescription' },
      { status: 500 }
    );
  }
}