import { PrismaClient } from '@prisma/client';
import OrderList from './OrderList';

const prisma = new PrismaClient();

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
  return orders;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      <OrderList orders={orders} />
    </div>
  );
}
