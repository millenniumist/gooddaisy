
import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
