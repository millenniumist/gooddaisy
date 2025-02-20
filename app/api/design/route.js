import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';

export async function PUT(request) {
  const { userId, message } = await request.json();

  try {
    const updatedOrderItem = await prisma.orderItem.updateMany({
      where: {
        userId: parseInt(userId),
        status: 'PENDING'
      },
      data: {
        message: message
      }
    });

    return NextResponse.json(updatedOrderItem);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update design note' }, { status: 500 });
  }
}
