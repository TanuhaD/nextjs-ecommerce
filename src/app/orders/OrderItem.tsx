import { OrderItemWithProduct } from "@/lib/db/order";
import Image from "next/image";

interface OrderItemProps {
  item: OrderItemWithProduct;
}

export default function OrderItem({ item }: OrderItemProps) {
  return (
    <li key={item.id}>
      <div className="card-body">
        <div className="card-image">
          <Image
            src={item.product.imageUrl || "/no-image-placeholder.png"}
            alt={item.product.name}
            width={100}
            height={100}
            className="rounded-lg"
          />
        </div>
        <p className="font-medium text-info">Name:{item.product.name}</p>
        <p className="font-medium">Price: {item.price / 100} $</p>
        <p className="font-medium">Quantity: {item.quantity}</p>
      </div>
    </li>
  );
}
