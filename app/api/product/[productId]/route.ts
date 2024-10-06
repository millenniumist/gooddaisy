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
