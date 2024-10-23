import prisma from '@/config/prisma'
import { NextResponse } from 'next/server'
import { ProductionStatus } from '@prisma/client'

export async function POST(request: Request) {
  const formData = await request.formData()
  const itemId = Number(formData.get('itemId'))
  const orderId = Number(formData.get('orderId'))
  const status = formData.get('status') as ProductionStatus
  const note = formData.get('note') as string
  const colorRefinement = formData.get('colorRefinement') === 'on'
  const message = formData.get('message') as string
  const addOnItem = formData.get('addOnItem') === 'on'

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: itemId },
    include: { product: true },
  })

  if (!orderItem) {
    return NextResponse.json({ error: 'Order item not found' }, { status: 404 })
  }

  const newPrice = calculateNewPrice(orderItem, colorRefinement, message, addOnItem)

  const updatedItem = await prisma.orderItem.update({
    where: { id: itemId },
    data: {
      status,
      note,
      colorRefinement,
      message,
      addOnItem,
      price: newPrice,
    },
  })

  await updateOrderTotalPrice(orderId)

  return NextResponse.json({ message: 'Order item updated successfully', item: updatedItem })
}

function calculateNewPrice(orderItem: any, colorRefinement: boolean, message: string, addOnItem: boolean) {
  let newPrice = orderItem.product.price
  if (colorRefinement) {
    newPrice += (orderItem.product.colorRefinement ?? 0)
  }
  if (message && message.trim() !== '') {
    newPrice += (orderItem.product.message ?? 0)
  }
  if (addOnItem) {
    newPrice += (orderItem.product.addOnItem ?? 0)
  }
  return newPrice
}

async function updateOrderTotalPrice(orderId: number) {
  const updatedOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  })

  if (updatedOrder) {
    const newTotalPrice = updatedOrder.orderItems.reduce((total, item) => total + item.price, 0)
    await prisma.order.update({
      where: { id: orderId },
      data: { totalPrice: newTotalPrice },
    })
  }
}
