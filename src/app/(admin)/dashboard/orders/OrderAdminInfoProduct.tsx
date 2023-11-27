import {
  GetAllOrdersWithProductsResult,
  OrderItemWithProduct,
  OrderWithProducts,
} from "@/lib/db/order";
import Image from "next/image";

interface OrderInfoProductProps {
  item: OrderItemWithProduct;
}

export default function OrderAdminInfoProduct({ item }: OrderInfoProductProps) {
  return (
    <>
      <li
        key={item.product.id}
        className="mb-3 flex items-center gap-4 rounded-md border-2 border-solid border-gray-300  p-3 "
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
          <p className="font-medium text-info sm:text-sm md:text-2xl">
            {item.product.name}
          </p>
          <p className="font-medium sm:text-sm md:text-2xl">
            Price: {item.price / 100} $
          </p>
          <p className="font-medium sm:text-sm md:text-2xl">
            Quantity: {item.quantity}
          </p>
        </div>
      </li>
    </>
  );
}
