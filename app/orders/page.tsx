import prisma from '@/config/prisma';
import { revalidatePath } from 'next/cache';
import { Decimal } from '@prisma/client/runtime/library';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Toaster } from '@/components/ui/toaster';
import { ToastWrapper } from '@/components/ui/ToastWrapper';
import { Order, User, OrderItem, Product, ProductionStatus, PaymentStatus } from '@prisma/client';
import {format} from 'date-fns'

function formatOrderId(order: ExtendedOrder, orders: ExtendedOrder[]) {
  const createdDate = new Date(order.createdDate);
  const monthYear = format(createdDate, 'M-yy');

  const ordersInSameMonth = orders.filter(o =>
    format(new Date(o.createdDate), 'M-yy') === monthYear
  );

  const orderIndex = ordersInSameMonth.findIndex(o => o.id === order.id) + 1;
  return `${orderIndex}-${monthYear}`;
}
interface ExtendedOrder extends Order {
    user: User;
    orderItems: (OrderItem & { product: Product })[];
  }
  

async function getOrders() {
  return await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
}

async function updateOrderStatus(orderId: number, productionStatus: ProductionStatus, paymentStatus: PaymentStatus) {
  await prisma.order.update({
    where: { id: orderId },
    data: { productionStatus, paymentStatus },
  });
  revalidatePath('/orders-management');
  return { message: 'Order updated successfully' };
}

async function updateOrderItemDetails(
  itemId: number,
  orderId: number,
  status: ProductionStatus,
  note: string,
  colorRefinement: boolean,
  message: string,
  addOnItem: boolean
) {
  const orderItem = await prisma.orderItem.findUnique({
    where: { id: itemId },
    include: { product: true },
  });

  if (!orderItem) {
    throw new Error('Order item not found');
  }

  const newPrice = calculateNewPrice(orderItem, colorRefinement, message, addOnItem);

  await prisma.orderItem.update({
    where: { id: itemId },
    data: {
      status,
      note,
      colorRefinement,
      message,
      addOnItem,
      price: newPrice.toNumber(),
    },
  });

  await updateOrderTotalPrice(orderId);

  revalidatePath('/orders-management');
  return { message: 'Order item updated successfully' };
}

function calculateNewPrice(orderItem: any, colorRefinement: boolean, message: string, addOnItem: boolean) {
  let newPrice = new Decimal(orderItem.product.price);
  if (colorRefinement) {
    newPrice = newPrice.plus(new Decimal(orderItem.product.colorRefinement ?? 0));
  }
  if (message && message.trim() !== '') {
    newPrice = newPrice.plus(new Decimal(orderItem.product.message ?? 0));
  }
  if (addOnItem) {
    newPrice = newPrice.plus(new Decimal(orderItem.product.addOnItem ?? 0));
  }
  return newPrice;
}

async function updateOrderTotalPrice(orderId: number) {
  const updatedOrder = await prisma.order.findUnique({
    where: { id: orderId },
    include: { orderItems: true },
  });

  if (updatedOrder) {
    const newTotalPrice = updatedOrder.orderItems.reduce((total, item) => total.plus(new Decimal(item.price)), new Decimal(0));
    await prisma.order.update({
      where: { id: orderId },
      data: { totalPrice: newTotalPrice.toNumber() },
    });
  }
}

export async function updateOrder(formData: FormData) {
  'use server'
  const orderId = Number(formData.get('orderId'));
  const productionStatus = formData.get('productionStatus') as ProductionStatus;
  const paymentStatus = formData.get('paymentStatus') as PaymentStatus;
  return updateOrderStatus(orderId, productionStatus, paymentStatus);
}

export async function updateOrderItem(formData: FormData) {
  'use server'
  const itemId = Number(formData.get('itemId'));
  const orderId = Number(formData.get('orderId'));
  const status = formData.get('status') as ProductionStatus;
  const note = formData.get('note') as string;
  const colorRefinement = formData.get('colorRefinement') === 'on';
  const message = formData.get('message') as string;
  const addOnItem = formData.get('addOnItem') === 'on';
  return updateOrderItemDetails(itemId, orderId, status, note, colorRefinement, message, addOnItem);
}

export default async function OrdersManagementPage() {
  const orders = await getOrders();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>
      <Accordion type="single" collapsible className="w-full">
        {orders.map((order) => (
          <AccordionItem key={order.id} value={`order-${order.id}`}>
            <AccordionTrigger>Order #{formatOrderId(order, orders)}</AccordionTrigger>
            <AccordionContent>
              <OrderDetails order={order} />
              <OrderItems orderItems={order.orderItems} orderId={order.id} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Toaster/>
    </div>
  );
}

function OrderDetails({ order }: { order: ExtendedOrder
 }) {
  return (
    <ToastWrapper onSubmit={updateOrder}>
      <input type="hidden" name="orderId" value={order.id} />
      <p>User: {order.user.displayName}</p>
      <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
      <StatusSelect name="productionStatus" label="Production Status" defaultValue={order.productionStatus} options={ProductionStatus} />
      <StatusSelect name="paymentStatus" label="Payment Status" defaultValue={order.paymentStatus} options={PaymentStatus} />
      <Button type="submit" className="mt-2">Update Order</Button>
    </ToastWrapper>
  );
}

function OrderItems({ orderItems, orderId }: { orderItems: any[], orderId: number }) {
  return (
    <>
      <h3 className="text-lg font-semibold mt-4 mb-2">Order Items:</h3>
      {orderItems.map((item) => (
        <OrderItemForm key={item.id} item={item} orderId={orderId} />
      ))}
    </>
  );
}

function OrderItemForm({ item, orderId }: { item: any, orderId: number }) {
  return (
    <ToastWrapper onSubmit={updateOrderItem}>
      <input type="hidden" name="itemId" value={item.id} />
      <input type="hidden" name="orderId" value={orderId} />
      <p>Product: {item.product.name}</p>
      <p>Price: ${item.price.toFixed(2)}</p>
      <StatusSelect name="status" label="Status" defaultValue={item.status} options={ProductionStatus} />
      <TextAreaField name="note" label="Note" defaultValue={item.note || ''} />
      <CheckboxField id={`colorRefinement-${item.id}`} name="colorRefinement" label={`Color Refinement (+$${item.product.colorRefinement?.toFixed(2) ?? '0.00'})`} defaultChecked={item.colorRefinement} />
      <InputField name="message" label="Message" defaultValue={item.message || ''} helperText={`(+$${item.product.message?.toFixed(2) ?? '0.00'} if not empty)`} />
      <CheckboxField id={`addOnItem-${item.id}`} name="addOnItem" label={`Add-on Item (+$${item.product.addOnItem?.toFixed(2) ?? '0.00'})`} defaultChecked={item.addOnItem} />
      <Button type="submit" className="mt-2">Update Item</Button>
    </ToastWrapper>
  );
}

function StatusSelect({ name, label, defaultValue, options }: { name: string, label: string, defaultValue: string, options: any }) {
  return (
    <div className="mb-2">
      <label className="block">{label}:</label>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {Object.values(options).map((status) => (
            <SelectItem key={status} value={status}>{status}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function TextAreaField({ name, label, defaultValue }: { name: string, label: string, defaultValue: string }) {
  return (
    <div className="mb-2">
      <label className="block">{label}:</label>
      <Textarea name={name} defaultValue={defaultValue} className="w-full" />
    </div>
  );
}

function CheckboxField({ id, name, label, defaultChecked }: { id: string, name: string, label: string, defaultChecked: boolean }) {
  return (
    <div className="flex items-center mb-2">
      <Checkbox id={id} name={name} defaultChecked={defaultChecked} />
      <label htmlFor={id} className="ml-2">{label}</label>
    </div>
  );
}

function InputField({ name, label, defaultValue, helperText }: { name: string, label: string, defaultValue: string, helperText?: string }) {
  return (
    <div className="mb-2">
      <label className="block">{label}:</label>
      <Input type="text" name={name} defaultValue={defaultValue} className="w-full" />
      {helperText && <span className="text-sm text-gray-500">{helperText}</span>}
    </div>
  );
}

