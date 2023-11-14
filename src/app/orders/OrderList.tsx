import { OrderWithProducts, OrderWithTotal } from "@/lib/db/order";
import OrderItem from "./OrderItem";

interface OrderListProps {
  order: OrderWithTotal;
}

export default function OrderList({ order }: OrderListProps) {
  return (
    <>
      <ul className=" p-4">
        {order.items.map((item) => {
          return <OrderItem key={item.id} item={item} />;
        })}
        <div className="flex-auto text-center font-bold">
          Total: {order.total / 100} $
        </div>
        <div className="flex-auto text-center font-bold">
          Created: {order.createdAt.getDate()}.{order.createdAt.getMonth()}.
          {order.createdAt.getFullYear()}
        </div>
      </ul>
      <div className="divider"></div>
    </>
  );
}
