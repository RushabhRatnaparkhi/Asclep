import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the file to base64
    const fileBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(fileBuffer).toString('base64');
    const uploadString = `data:${file.type};base64,${base64String}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(uploadString, {
      folder: 'prescriptions',
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}