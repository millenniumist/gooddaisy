import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function GET(request, { params }) {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(params.productId),
    },
    include: {
      images: true,
    },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function POST(req) {
  const { colorRefinement, addOnItem, message, productId, price, name, userId } = await req.json()

  try {
    const newOrderItem = await prisma.orderItem.create({
      data: {
        name,
        price,
        colorRefinement,
        message,
        addOnItem,
        productId: parseInt(productId),
        userId: parseInt(userId),
      },
    })

    return new Response(JSON.stringify({ newOrderItem }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create order item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function DELETE(req, { params }) {
  try {
    const productId = Number(params.productId);
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    for (const image of product.images) {
      const publicId = image.url.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
      include: { images: true },
    });

    return NextResponse.json({ deletedProduct });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
