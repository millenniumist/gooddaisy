import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';

export async function PUT(request: Request, { params }: { params: { orderId: string } }) {
  const { orderId } = params;
  const body = await request.json();

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: body,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'An error occurred while updating the order' }, { status: 500 });
  }
}
