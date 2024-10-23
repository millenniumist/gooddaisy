import prisma from '@/config/prisma'
import { NextResponse } from 'next/server'
import { ProductionStatus, PaymentStatus } from '@prisma/client';

export async function POST(request: Request) {
  const formData = await request.formData()
  const orderId = Number(formData.get('orderId'))
  const productionStatus = formData.get('productionStatus') as ProductionStatus
  const paymentStatus = formData.get('paymentStatus') as PaymentStatus

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { productionStatus, paymentStatus },
  })

  return NextResponse.json({ message: 'Order updated successfully', order: updatedOrder })
}
