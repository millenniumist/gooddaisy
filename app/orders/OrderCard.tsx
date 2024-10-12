import { useState } from "react";
import { Order, User, OrderItem, Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import OrderItemList from "./OrderItemList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OrderWithRelations = Order & {
  user: User;
  orderItems: (OrderItem & { product: Product })[];
};

type OrderCardProps = {
  order: OrderWithRelations;
  onUpdate: (orderId: string, field: string, value: string) => void;
  onItemUpdate: (orderId: string, itemId: string, field: string, value: any) => void;
  productionStatuses: string[]; 
  paymentStatuses: string[];
};

export default function OrderCard({ order, onUpdate, onItemUpdate, productionStatuses, paymentStatuses }: OrderCardProps) {
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => setEditMode(!editMode);

  return (
    <Card>
      <div className="flex justify-between items-baseline px-4">
        <CardTitle>Order #{order.id}</CardTitle>
        <Button onClick={toggleEditMode} className="mt-4" variant="outline">
          {editMode ? "Save" : "Edit"}
        </Button>
      </div>
      <CardContent>
        <p className="mb-2">User: {order.user.displayName}</p>
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="w-24">Status:</span>
            {editMode ? (
              <Select
                value={order.productionStatus}
                onValueChange={(value) => onUpdate(order.id, "productionStatus", value)}
              >
                <SelectTrigger className="ml-2 w-48">
                  <SelectValue placeholder="Select production status" />
                </SelectTrigger>
                <SelectContent>
                  {productionStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="ml-2">{order.productionStatus}</span>
            )}
          </div>
          <div className="flex items-center">
            <span className="w-24">Payment:</span>
            {editMode ? (
              <Select
                value={order.paymentStatus}
                onValueChange={(value) => onUpdate(order.id, "paymentStatus", value)}
              >
                <SelectTrigger className="ml-2 w-48">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="ml-2">{order.paymentStatus}</span>
            )}
          </div>
          <div className="flex items-center">
            <span className="w-24">Total Price:</span>
            {editMode ? (
              <Input
                value={order.totalPrice.toFixed(2)}
                onChange={(e) => onUpdate(order.id, "totalPrice", e.target.value)}
                className="ml-2 w-48"
                type="number"
                step="0.01"
              />
            ) : (
              <span className="ml-2">${order.totalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
        <OrderItemList 
          orderItems={order.orderItems} 
          orderId={order.id} 
          editMode={editMode} 
          onItemUpdate={onItemUpdate} 
        />
      </CardContent>
    </Card>
  );
}