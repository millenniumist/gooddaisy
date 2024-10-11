"use client";
import { useState } from "react";
import { Order, User, OrderItem, Product } from "@prisma/client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type OrderWithRelations = Order & {
  user: User;
  orderItems: (OrderItem & { product: Product })[];
};

type OrderListProps = {
  orders: OrderWithRelations[];
};

export default function OrderList({ orders: initialOrders }: OrderListProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});

  const handleUpdate = async (orderId: string, field: string, value: string) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, { [field]: value });
      if (response.status === 200) {
        setOrders(
          orders.map((order) => (order.id === orderId ? { ...order, [field]: value } : order))
        );
        toggleEditMode(orderId); // Close the edit box after successful update
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
      // We're not adding any price for addOnItem

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

  const toggleEditMode = (id: string) => {
    setEditMode((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>Order #{order.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">User: {order.user.displayName}</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-24">Status:</span>
                {editMode[order.id] ? (
                  <Input
                    value={order.productionStatus}
                    onChange={(e) => handleUpdate(order.id, "productionStatus", e.target.value)}
                    className="ml-2 w-48"
                  />
                ) : (
                  <span className="ml-2">{order.productionStatus}</span>
                )}
              </div>
              <div className="flex items-center">
                <span className="w-24">Payment:</span>
                {editMode[order.id] ? (
                  <Input
                    value={order.paymentStatus}
                    onChange={(e) => handleUpdate(order.id, "paymentStatus", e.target.value)}
                    className="ml-2 w-48"
                  />
                ) : (
                  <span className="ml-2">{order.paymentStatus}</span>
                )}
              </div>
              <div className="flex items-center">
                <span className="w-24">Total Price:</span>
                {editMode[order.id] ? (
                  <Input
                    value={order.totalPrice.toFixed(2)}
                    onChange={(e) => handleUpdate(order.id, "totalPrice", e.target.value)}
                    className="ml-2 w-48"
                    type="number"
                    step="0.01"
                  />
                ) : (
                  <span className="ml-2">${order.totalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Order Items:</h3>
            <ul className="list-disc pl-6">
              {order.orderItems.map((item) => (
                <li key={item.id} className="mb-4">
                  <div className="flex items-center justify-between">
                    <span>
                      {item.product?.name || "Unknown Product"} - ${item.price.toFixed(2)}
                    </span>
                    {editMode[order.id] && (
                      <Button
                        onClick={() => toggleEditMode(`${order.id}-${item.id}`)}
                        variant="outline"
                        size="sm"
                      >
                        {editMode[`${order.id}-${item.id}`] ? "Save" : "Edit Item"}
                      </Button>
                    )}
                  </div>
                  {editMode[`${order.id}-${item.id}`] && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`colorRefinement-${item.id}`}
                          checked={item.colorRefinement}
                          onCheckedChange={(checked) =>
                            handleItemUpdate(order.id, item.id, "colorRefinement", checked)
                          }
                        />
                        <Label htmlFor={`colorRefinement-${item.id}`}>Color Refinement</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          id={`message-${item.id}`}
                          value={item.message || ""}
                          onChange={(e) =>
                            handleItemUpdate(order.id, item.id, "message", e.target.value)
                          }
                          placeholder="Message"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`addOnItem-${item.id}`}
                          checked={item.addOnItem}
                          onCheckedChange={(checked) =>
                            handleItemUpdate(order.id, item.id, "addOnItem", checked)
                          }
                        />
                        <Label htmlFor={`addOnItem-${item.id}`}>Add-on Item</Label>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <Button onClick={() => toggleEditMode(order.id)} className="mt-4" variant="outline">
              {editMode[order.id] ? "Save" : "Edit"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
