import { Order, User, OrderItem, Product } from '@prisma/client';

type OrderWithRelations = Order & {
  user: User;
  orderItems: (OrderItem & { product: Product })[];
};

type OrderListProps = {
  orders: OrderWithRelations[];
};

export default function OrderList({ orders }: OrderListProps) {
  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
          <p>User: {order.user.displayName}</p>
          <p>Status: {order.productionStatus}</p>
          <p>Payment: {order.paymentStatus}</p>
          <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Order Items:</h3>
          <ul className="list-disc pl-6">
            {order.orderItems.map((item) => (
              <li key={item.id}>
                {item.product.name} - ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
