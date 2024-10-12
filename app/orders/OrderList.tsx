"use client";
import { useState } from "react";
import { Order, User, OrderItem, Product } from "@prisma/client";
import axios from "axios";
import OrderCard from "./OrderCard";

type OrderWithRelations = Order & {
  user: User;
  orderItems: (OrderItem & { product: Product })[];
};

type OrderListProps = {
  orders: OrderWithRelations[];
};

export default function OrderList({ orders: initialOrders, productionStatuses, paymentStatuses }: OrderListProps) {
  const [orders, setOrders] = useState(initialOrders);

  const handleUpdate = async (orderId: string, field: string, value: string) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, { [field]: value });
      if (response.status === 200) {
        setOrders(
          orders.map((order) => (order.id === orderId ? { ...order, [field]: value } : order))
        );
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleItemUpdate = async (orderId: string, itemId: string, field: string, value: any) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      const item = order?.orderItems.find((i) => i.id === itemId);
      if (!item || !order) return;

      let newPrice = item.product.price;
      const updatedItem = { ...item, [field]: value };

      if (updatedItem.colorRefinement) newPrice += item.product.colorRefinement || 0;
      if (updatedItem.message) newPrice += item.product.message || 0;

      const response = await axios.put(`/api/orders/${orderId}/items/${itemId}`, {
        ...updatedItem,
        price: newPrice,
      });

      if (response.status === 200) {
        setOrders(
          orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  orderItems: o.orderItems.map((i) => (i.id === itemId ? response.data : i)),
                  totalPrice: o.orderItems.reduce(
                    (sum, i) => (i.id === itemId ? sum + newPrice : sum + i.price),
                    0
                  ),
                }
              : o
          )
        );
      }
    } catch (error) {
      console.error("Error updating order item:", error);
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onUpdate={handleUpdate}
          onItemUpdate={handleItemUpdate}
          productionStatuses={productionStatuses}
          paymentStatuses={paymentStatuses}
        />
      ))}
    </div>
  );
}
