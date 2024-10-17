import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/config/prisma';
import { format } from 'date-fns';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64File}`;

    const currentDate = new Date();
    const monthYear = format(currentDate, 'M-yy');

    const ordersInCurrentMonth = await prisma.order.count({
      where: {
        createdDate: {
          gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
        },
      },
    });

    const orderIndex = ordersInCurrentMonth + 1;
    const fileName = `${orderIndex}-${monthYear}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      public_id: fileName,
      folder: 'orders',
    });

    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      url: result.secure_url,
      fileName: fileName
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
