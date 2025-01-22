import prisma from '@/config/prisma'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get('startDate');
  const currentDate = new Date();

  const [orders, ordersInCurrentMonth] = await Promise.all([
    prisma.order.findMany({
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
    }),
    prisma.order.count({
      where: {
        createdDate: {
          gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          lt: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
        },
      },
    })
  ]);

  return NextResponse.json({
    orders,
    ordersInCurrentMonth
  });
}
