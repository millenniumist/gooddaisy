import { NextResponse } from 'next/server';
import prisma from '@/config/prisma';

export async function PUT(
    request: Request, 
    { params }: { params: { orderId: number, itemId: number } }
  ) {
    const { orderId, itemId } = params;
    const body = await request.json();
  
    try {
      const orderItem = await prisma.orderItem.findUnique({
        where: { id: itemId },
        include: { product: true },
      });
  
      if (!orderItem) {
        return NextResponse.json({ error: 'Order item not found' }, { status: 404 });
      }
  
      let newPrice = orderItem.product.price;
      if (body.colorRefinement) newPrice += orderItem.product.colorRefinement || 0;
      if (body.message && body.message.trim() !== '') newPrice += orderItem.product.message || 0;
      // Remove any price calculation for addOnItem
  
      const updatedOrderItem = await prisma.orderItem.update({
        where: { id: itemId },
        data: {
          status: body.status,
          price: newPrice,
          note: body.note,
          colorRefinement: body.colorRefinement,
          message: body.message,
          addOnItem: body.addOnItem
        },
        include: { product: true }
      });
      
  
      // Update order total price
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true },
      });
  
      if (order) {
        const newTotalPrice = order.orderItems.reduce((sum, item) => 
          item.id === updatedOrderItem.id ? sum + newPrice : sum + item.price, 0
        );
  
        await prisma.order.update({
          where: { id: orderId },
          data: { totalPrice: newTotalPrice },
        });
      }
  
      return NextResponse.json(updatedOrderItem);
    } catch (error) {
      console.error('Error updating order item:', error);
      return NextResponse.json({ error: 'An error occurred while updating the order item' }, { status: 500 });
    }
  }
  


  