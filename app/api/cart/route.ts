
import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';

export async function GET(request: Request) {
  const userId = 1

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const cartItems = await prisma.orderItem.findMany({
      where: {
        userId: userId ,
        status: 'CART'
      },
      include: {
        product: {
          select:{
            images: true,
            name: true
          }
        }
      }

    });

    if (!cartItems) {
      return NextResponse.json({ error: 'Cart items not found' }, { status: 200 });
    }

    return NextResponse.json({ cartItems }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
    return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
  }
}
