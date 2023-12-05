import { OrderItemWithProduct } from "@/lib/db/order";
import Image from "next/image";

interface OrderItemProps {
  item: OrderItemWithProduct;
}

export default function OrderItem({ item }: OrderItemProps) {
  return (
    <li
      key={item.id}
      className="mb-3 rounded-md border-2 border-solid border-gray-300 p-3 "
    >
      <div className="flex items-center gap-4">
        <div className="card-image">
          <Image
            src={item.product.imageUrl || "/no-image-placeholder.png"}
            alt={item.product.name}
            width={100}
            height={100}
            className="rounded-lg"
          />
        </div>
        <div className="gap-4">
          <p className="break-words font-medium text-info">
            {item.product.name}
          </p>
          <p className="font-medium">Price: {item.price / 100} $</p>
          <p className="font-medium">Quantity: {item.quantity}</p>
        </div>
      </div>
    </li>
  );
}
