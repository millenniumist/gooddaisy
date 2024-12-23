import prisma from '@/config/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get('startDate');

  const orders = await prisma.order.findMany({
    where: {
      createdDate: {
        gte: startDate ? new Date(startDate) : undefined,
      },
    },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json(orders);
}
