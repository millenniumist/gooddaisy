import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET
});
export async function GET(
  request: Request,
  { params }: { params: { productId: number } }
) {
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

export async function POST(req: Request) {
  const { colorRefinement, addOnItem, message, productId, price, name, userId } = await req.json()
  // console.log(colorRefinement, addOnItem, message, productId, price, name)
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

    return new Response(JSON.stringify({newOrderItem }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: 'Failed to create order item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const productId = Number(params.productId);
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      const publicId = image.url.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Delete the product and its associated images from the database
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
      include: { images: true },
    });

    return NextResponse.json({ deletedProduct });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}