import OrderList from './OrderList';
import prisma from '@/config/prisma';

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });
  return orders;
}

import { ProductionStatus, PaymentStatus } from '@prisma/client';




export default async function OrdersPage() {
  const orders = await getOrders();
  const productionStatuses = Object.values(ProductionStatus);
  const paymentStatuses = Object.values(PaymentStatus);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      <OrderList orders={orders} productionStatuses={productionStatuses} paymentStatuses={paymentStatuses} />
    </div>
  );
}
