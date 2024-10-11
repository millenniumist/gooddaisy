
import { NextResponse } from 'next/server';
import prisma, { user } from '@/config/prisma';
import { useParams } from 'next/navigation';



export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
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

