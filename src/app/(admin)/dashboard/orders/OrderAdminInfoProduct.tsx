import { GetAllOrdersWithProductsResult, OrderItemWithProduct, OrderWithProducts } from "@/lib/db/order";
import Image from "next/image";

interface OrderInfoProductProps {
  item: OrderItemWithProduct;
}

export default function OrderAdminInfoProduct({ item }: OrderInfoProductProps) {
  return (
    <>
      <li
        key={item.product.id}
        className="mb-3 flex gap-4 rounded-md border-2 border-solid border-gray-300 p-3 sm:flex-col md:flex-row  md:items-center "
      >
        <div className="card-image">
          <Image
            src={item.product.imageUrl || "/no-image-placeholder.png"}
            alt={item.product.name}
            width={100}
            height={100}
            className=" mb-4 rounded-lg"
          />
        </div>
        <div className="gap-4">
          <p className="break-words font-medium text-info sm:text-sm md:text-xl">{item.product.name}</p>
          <p className="font-medium sm:text-sm md:text-xl">Price: {item.price / 100} $</p>
          <p className=" font-medium sm:text-sm md:text-xl">Quantity: {item.quantity}</p>
        </div>
      </li>
    </>
  );
}
