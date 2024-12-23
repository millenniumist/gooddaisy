import prisma from '@/config/prisma'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const formData = await request.formData()
    
    // Destructure and validate form data
    const data = {
      orderId: Number(formData.get('orderId')),
      orderStatus: formData.get('orderStatus'),
      paymentStatus: formData.get('paymentStatus')
    }

    // Validate orderId
    if (!data.orderId || isNaN(data.orderId)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: data.orderId },
      data: { 
        orderStatus: data.orderStatus,
        paymentStatus: data.paymentStatus 
      },
    })

    return NextResponse.json({ 
      message: 'Order updated successfully', 
      order: updatedOrder 
    }, { status: 200 })

  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update order' 
    }, { status: 500 })
  }
}
