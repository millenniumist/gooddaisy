'use client'
import { useState } from "react";
import { OrderItem, Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import OrderItemCard from "./OrderItemCard";

type OrderItemWithProduct = OrderItem & { product: Product };

type OrderItemListProps = {
  orderItems: OrderItemWithProduct[];
  orderId: number;
  editMode: boolean;
  onItemUpdate: (orderId: number, itemId: number, field: string, value: any) => void;
};

export default function OrderItemList({ orderItems, orderId, editMode, onItemUpdate }: OrderItemListProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItemExpand = (itemId: number) => {
    setExpandedItems((prev) => ({
      ...prev, 
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mt-4 mb-2">Order Items:</h3>
      <ul className="list-disc pl-6">
        {orderItems.map((item) => (
          <OrderItemCard
            key={item.id}
            item={item}
            orderId={orderId}
            editMode={editMode}
            expanded={expandedItems[item.id]}
            onToggleExpand={() => toggleItemExpand(item.id)}
            onUpdate={onItemUpdate}
          />
        ))}
      </ul>
    </div>
  );
}
