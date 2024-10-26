export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';
import { cookies } from 'next/headers';



export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    // First find cart items
    const cartItems = await prisma.orderItem.findMany({
      where: {
        userId: Number(userId),
        status: 'CART',
        orderId: null,
      }
    });

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    // Use a transaction to ensure all updates happen together
    const order = await prisma.$transaction(async (tx) => {
      // First update the orderItems status
      await tx.orderItem.updateMany({
        where: {
          id: {
            in: cartItems.map(item => item.id)
          }
        },
        data: {
          status: 'PENDING'
        }
      });

      // Then create the order with the updated items
      return tx.order.create({
        data: {
          userId: Number(userId),
          paymentStatus: 'UNPAID',
          orderStatus: 'PENDING',
          totalPrice: cartItems.reduce((total, item) => total + item.price, 0),
          orderItems: {
            connect: cartItems.map(item => ({ id: item.id }))
          }
        },
        include: {
          orderItems: true
        }
      });
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}


export async function DELETE() {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId');
    //console.log("Delete is working",userId)
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    const deleteItem = await prisma.orderItem.deleteMany({
      where: {
        userId: Number(userId.value),
        status: 'CART',
        orderId: null,
      }
    });
    return NextResponse.json({ deleteItem }, { status: 200 });
} catch (error) {
  console.error('Failed to delete order:', error);
  return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
}
}