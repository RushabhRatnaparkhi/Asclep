import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Prescription from '@/models/Prescription';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(request, context) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await dbConnect();
    const prescription = await Prescription.findOne({
      _id: context.params.id,
      userId: decoded.userId
    });

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    // Generate a fresh signed URL for download
    const signedUrl = cloudinary.utils.private_download_url(
      prescription.publicId,
      'pdf',
      {
        resource_type: 'raw',
        type: 'authenticated',
        attachment: true,
        expires_at: Math.floor(Date.now() / 1000) + (60 * 60) // URL valid for 1 hour
      }
    );

    return NextResponse.json({ downloadUrl: signedUrl });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download link' },
      { status: 500 }
    );
  }
}