"use client";

import { useEffect, useState } from "react";
import { format, subMonths } from "date-fns";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster } from "@/components/ui/toaster";
import { ToastWrapper } from "@/components/ui/ToastWrapper";
import {
  Order,
  User,
  OrderItem,
  Product,
  ProductionStatus,
  PaymentStatus,
  OrderStatus,
} from "@prisma/client";

interface ExtendedOrder extends Order {
  user: User;
  orderItems: (OrderItem & { product: Product })[];
}

function formatOrderId(order: ExtendedOrder, orders: ExtendedOrder[]) {
  const createdDate = new Date(order.createdDate);
  const monthYear = format(createdDate, "M-yy");

  const ordersInSameMonth = orders.filter(
    (o) => format(new Date(o.createdDate), "M-yy") === monthYear
  );

  const orderIndex = ordersInSameMonth.findIndex((o) => o.id === order.id) + 1;
  return `${orderIndex}-${monthYear}`;
}

export default function OrdersManagementPage() {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ExtendedOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      const sixMonthsAgo = subMonths(new Date(), 6);
      const response = await fetch(`/api/orders?startDate=${sixMonthsAgo.toISOString()}`);
      const data = await response.json();
      setOrders(data);
      setFilteredOrders(data);
    };
    fetchOrders();
  }, []);

  const handleSearch = debounce((term: string) => {
    setSearchTerm(term);
    const filtered = orders.filter((order) =>
      formatOrderId(order, orders).toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, 300);

  const handleOrderUpdate = async (formData: FormData) => {
    const response = await fetch("/api/orders/update", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    const updatedOrders = await fetch("/api/orders").then((res) => res.json());
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    return data;
  };

  const handleOrderItemUpdate = async (formData: FormData) => {
    const response = await fetch("/api/orders/items/update", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    const updatedOrders = await fetch("/api/orders").then((res) => res.json());
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    return data;
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * 50,
    currentPage * 50
  );

  const totalPages = Math.ceil(filteredOrders.length / 50);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
      <div className="flex items-center gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search orders by ID (e.g., 1-12-23)"
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
        <span className="text-sm text-gray-500">
          Showing {filteredOrders.length} orders
        </span>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {paginatedOrders.map((order) => (
          <AccordionItem key={order.id} value={`order-${order.id}`}>
            <AccordionTrigger>
              Order #{formatOrderId(order, filteredOrders)}
            </AccordionTrigger>
            <AccordionContent>
              <OrderDetails order={order} onSubmit={handleOrderUpdate} />
              <OrderItems
                orderItems={order.orderItems}
                orderId={order.id}
                onSubmit={handleOrderItemUpdate}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      <Toaster />
    </div>
  );
}

function OrderDetails({
  order,
  onSubmit,
}: {
  order: ExtendedOrder;
  onSubmit: (formData: FormData) => Promise<any>;
}) {
  return (
    <ToastWrapper onSubmit={onSubmit}>
      <input type="hidden" name="orderId" value={order.id} />
      <p>User: {order.user.displayName}</p>
      <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
      <StatusSelect
        name="productionStatus"
        label="Production Status"
        defaultValue={order.productionStatus}
        options={ProductionStatus}
      />
      <StatusSelect
        name="paymentStatus"
        label="Payment Status"
        defaultValue={order.paymentStatus}
        options={PaymentStatus}
      />
      <Button type="submit" className="mt-2">
        Update Order
      </Button>
    </ToastWrapper>
  );
}

function OrderItems({
  orderItems,
  orderId,
  onSubmit,
}: {
  orderItems: (OrderItem & { product: Product })[];
  orderId: number;
  onSubmit: (formData: FormData) => Promise<any>;
}) {
  return (
    <>
      <h3 className="text-lg font-semibold mt-4 mb-2">Order Items:</h3>
      {orderItems.map((item) => (
        <OrderItemForm key={item.id} item={item} orderId={orderId} onSubmit={onSubmit} />
      ))}
    </>
  );
}

function OrderItemForm({
  item,
  orderId,
  onSubmit,
}: {
  item: OrderItem & { product: Product };
  orderId: number;
  onSubmit: (formData: FormData) => Promise<any>;
}) {
  return (
    <ToastWrapper onSubmit={onSubmit}>
      <input type="hidden" name="itemId" value={item.id} />
      <input type="hidden" name="orderId" value={orderId} />
      <p>Product: {item.product.name}</p>
      <p>Price: ${item.price.toFixed(2)}</p>
      <StatusSelect
        name="status"
        label="Status"
        defaultValue={item.status}
        options={ProductionStatus}
      />
      <TextAreaField name="note" label="Note" defaultValue={item.note || ""} />
      <CheckboxField
        id={`colorRefinement-${item.id}`}
        name="colorRefinement"
        label={`Color Refinement (+${item.product.colorRefinement?.toFixed(2) ?? "0.00"})`}
        defaultChecked={item.colorRefinement}
      />
      <InputField
        name="message"
        label="Message"
        defaultValue={item.message || ""}
        helperText={`(+${item.product.message?.toFixed(2) ?? "0.00"} if not empty)`}
      />
      <CheckboxField
        id={`addOnItem-${item.id}`}
        name="addOnItem"
        label={`Add-on Item (+${item.product.addOnItem?.toFixed(2) ?? "0.00"})`}
        defaultChecked={item.addOnItem}
      />
      <Button type="submit" className="mt-2">
        Update Item
      </Button>
    </ToastWrapper>
  );
}

function StatusSelect({
  name,
  label,
  defaultValue,
  options,
}: {
  name: string;
  label: string;
  defaultValue: string;
  options: typeof ProductionStatus | typeof PaymentStatus | typeof OrderStatus;
}) {
  return (
    <div className="mb-2">
      <label className="block">{label}:</label>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {Object.values(options).map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TextAreaField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <div className="mb-2">
      <label className="block">{label}:</label>
      <Textarea name={name} defaultValue={defaultValue} className="w-full" />
    </div>
  );
}

function CheckboxField({
  id,
  name,
  label,
  defaultChecked,
}: {
  id: string;
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center mb-2">
      <Checkbox id={id} name={name} defaultChecked={defaultChecked} />
      <label htmlFor={id} className="ml-2">
        {label}
      </label>
    </div>
  );
}

function InputField({
  name,
  label,
  defaultValue,
  helperText,
}: {
  name: string;
  label: string;
  defaultValue: string;
  helperText?: string;
}) {
  return (
    <div className="mb-2">
      <label className="block">{label}:</label>
      <Input type="text" name={name} defaultValue={defaultValue} className="w-full" />
      {helperText && <span className="text-sm text-gray-500">{helperText}</span>}
    </div>
  );
}
