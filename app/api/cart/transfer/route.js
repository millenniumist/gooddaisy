import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(req) {
  try {
    const { userId, cartItems } = await req.json()
    
    const createdItems = await prisma.orderItem.createMany({
      data: cartItems.map(item => ({
        name: item.name,
        price: item.price,
        productId: item.product.id,
        userId: userId,
        status: 'CART',
        colorRefinement: item.colorRefinement || false,
        message: item.message || null,
        addOnItem: item.addOnItem || false,
        note: item.note || null,
        variant: item.variant || null
      }))
    })

    return NextResponse.json({ success: true, createdItems })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
