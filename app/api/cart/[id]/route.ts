import prisma from "@/config/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const deleteItem = await prisma.orderItem.delete({ 
      where: { id: Number(id) } 
    });
    return NextResponse.json({ deleteItem }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

export async function GET(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    const parsedUserId = Number(id);

    if (!parsedUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const cartItems = await prisma.orderItem.findMany({
      where: {
        userId: parsedUserId,
        status: 'CART',
        orderId: null,
      },
      include: {
        product: {
          include: {
            images: true,
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
