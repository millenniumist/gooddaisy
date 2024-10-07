import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
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
  console.log(colorRefinement, addOnItem, message, productId, price, name)
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