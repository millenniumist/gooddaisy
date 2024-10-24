import prisma from '@/config/prisma'
import { NextResponse } from 'next/server'
import { ProductionStatus, PaymentStatus, Order, OrderStatus } from '@prisma/client';

export async function POST(request: Request) {
  const formData = await request.formData()
  const orderId = Number(formData.get('orderId'))
  const orderStatus = formData.get('orderStatus') as OrderStatus
  const paymentStatus = formData.get('paymentStatus') as PaymentStatus

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { orderStatus, paymentStatus },
  })

  return NextResponse.json({ message: 'Order updated successfully', order: updatedOrder })
}
