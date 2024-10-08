
import { NextResponse } from 'next/server';
import prisma, { user } from '@/config/prisma';
import { useParams } from 'next/navigation';

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

export async function POST(request: Request) {
  try {
    const userId = 1
    const cartItems = await prisma.orderItem.findMany({
      where: {
        userId: userId,
        status: 'CART'
      },
      include: {
        product: true
      }
    });

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: userId,
        paymentStatus: 'UNPAID',
        totalPrice: cartItems.reduce((total, item) => total + item.price, 0),
        orderItems: {
          connect: cartItems.map(item => ({ id: item.id }))
        },
      },
      include: {
        orderItems: true
      }
    });

    // Update the status of the order items and add orderId
    await prisma.orderItem.updateMany({
      where: {
        id: {
          in: cartItems.map(item => item.id)
        }
      },
      data: {
        status: 'PENDING',
        orderId: order.id
      }
    });
    console.log(order)
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

