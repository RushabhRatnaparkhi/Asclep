import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Prescription from '@/models/Prescription';
import { v2 as cloudinary } from 'cloudinary';
import Activity from '@/models/Activity';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary with basic options
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({
        resource_type: 'raw',
        folder: 'prescriptions'
      }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });

      uploadStream.end(buffer);
    });

    await dbConnect();

    const prescription = await Prescription.create({
      userId: decoded.userId,
      filename: file.name,
      url: uploadResponse.secure_url,
      contentType: file.type
    });

    // Create activity record
    await Activity.create({
      userId: decoded.userId,
      type: 'PRESCRIPTION_UPLOADED',
      description: `Uploaded prescription: ${file.name}`,
      prescriptionId: prescription._id
    });

    return NextResponse.json(prescription, { status: 201 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload prescription' },
      { status: 500 }
    );
  }
}