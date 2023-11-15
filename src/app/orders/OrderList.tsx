import { OrderWithProducts, OrderWithTotal } from "@/lib/db/order";
import OrderItem from "./OrderItem";

interface OrderListProps {
  order: OrderWithTotal;
}

export default function OrderList({ order }: OrderListProps) {
  return (
    <>
      <ul className=" rounded-md p-6 shadow-md ">
        {order.items.map((item) => {
          return <OrderItem key={item.id} item={item} />;
        })}
        <div className="flex-auto text-end font-bold">
          <p className="">Total: {order.total / 100} $</p>
          <p className="">
            Created: {order.createdAt.getDate()}.{order.createdAt.getMonth()}.
            {order.createdAt.getFullYear()}
          </p>
          <p>Status: {order.status}</p>
        </div>
      </ul>
      <div className="divider"></div>
    </>
  );
}
