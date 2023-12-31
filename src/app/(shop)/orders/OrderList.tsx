import { OrderWithProducts } from "@/lib/db/order";
import OrderItem from "./OrderItem";

interface OrderListProps {
  order: OrderWithProducts;
}

export default function OrderList({ order }: OrderListProps) {
  return (
    <>
      <ul className=" rounded-md bg-slate-50 p-6 shadow-md ">
        {order.items.map((item) => {
          return <OrderItem key={item.id} item={item} />;
        })}
        <div className="flex-auto  text-end font-bold">
          <p className="">Total: {order.total / 100} $</p>
          <p className="">
            Created: {order.createdAt.getDate()}.
            {order.createdAt.getMonth() + 1}.{order.createdAt.getFullYear()}
          </p>
          <p>Status: {order.status}</p>
        </div>
      </ul>
      <div className="color-primary divider"></div>
    </>
  );
}
