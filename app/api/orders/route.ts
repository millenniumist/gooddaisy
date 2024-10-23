import prisma from '@/config/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })
  return NextResponse.json(orders)
}
