import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/config/prisma';
import { format } from 'date-fns';
import nodemailer from 'nodemailer';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

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
    const user = await prisma.user.findFirst({
      where: {
        orders: {
          some: {
            customId: fileName
          }
        }
      },
      select: {
        displayName: true,
        statusMessage: true
      }
    });

    const result = await cloudinary.uploader.upload(dataURI, {
      public_id: fileName,
      folder: 'orders',
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Order Slip: ${user.displayName} ${user.statusMessage ? `- ${user.statusMessage}` : ''}`,
      text: `New order slip uploaded: ${fileName}`,
      html: `<p>New order slip uploaded: ${fileName}</p><img src="${result.secure_url}" />`,
      attachments: [
        {
          filename: `${fileName}.${file.type.split('/')[1]}`,
          content: Buffer.from(base64File, 'base64'),
          contentType: file.type
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      message: 'Image uploaded successfully and email sent',
      url: result.secure_url,
      fileName: fileName
    });

  } catch (error) {
    console.error('Error uploading image or sending email:', error);
    return NextResponse.json({ error: 'Failed to upload image or send email' }, { status: 500 });
  }
}
