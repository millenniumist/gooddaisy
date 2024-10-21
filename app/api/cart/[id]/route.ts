import prisma from "@/config/prisma";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    console.log(id)
    const deleteItem = await prisma.orderItem.delete({ where: { id: id } });
    return NextResponse.json({ deleteItem }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const userId = params.id;
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const cartItems = await prisma.orderItem.findMany({
      where: {
        userId: Number(userId),
        status: 'CART'
      },
      include: {
        product: true
      }
    }

    );
    if (!cartItems) {
      return NextResponse.json({ error: 'Cart items not found' }, { status: 200 });
    }

    return NextResponse.json({ cartItems }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
    return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
  }
}