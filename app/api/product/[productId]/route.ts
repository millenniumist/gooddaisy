import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';
import { v2 as cloudinary } from 'cloudinary';

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

export async function DELETE(req: Request, { params }: { params: { productId: number } }) {
  try {
    // Fetch the product with its images
    const productId = Number(params.productId)
    console.log(params.productId)
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { images: true },
    });

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
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
      where: { id: Number(productId) },
      include: { images: true },
    });

    return new Response(JSON.stringify({ deletedProduct }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: 'Failed to delete product' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}