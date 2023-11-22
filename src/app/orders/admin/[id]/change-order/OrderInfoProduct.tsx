import { OrderItemWithProduct } from "@/lib/db/order";
import Image from "next/image";
import { useEffect, useState } from "react";

interface OrderInfoProductProps {
  item: OrderItemWithProduct;
  quantityChangeHandler: ({
    itemId,
    newQuantity,
  }: {
    itemId: string;
    newQuantity: string;
  }) => void;
}
export default function OrderInfoProduct({
  item,
  quantityChangeHandler,
}: OrderInfoProductProps) {
  const [quantity, setQuantity] = useState<string>(item.quantity + "");

  useEffect(() => {
    console.log("quantity", quantity);
    quantityChangeHandler({ newQuantity: quantity, itemId: item.id });
  }, [item.id, quantity, quantityChangeHandler]);

  return (
    <li className="mb-3 rounded-md border-2 border-solid border-gray-300 p-3 ">
      <div className="flex items-center gap-4 ">
        <div className="card-image">
          <Image
            src={item.product.imageUrl || "/no-image-placeholder.png"}
            alt={item.product.name}
            width={100}
            height={100}
            className="rounded-lg"
          />
        </div>
        <div className=" gap-4">
          <p className="font-medium text-info sm:text-sm md:text-2xl">
            {item.product.name}
          </p>
          <p className="font-medium sm:text-sm md:text-2xl">
            Price: {item.price / 100} $
          </p>
          <p className="font-medium  sm:text-sm md:text-2xl">
            Quantity:
            <input
              type="number"
              className="input-ghost input w-full max-w-xs sm:text-sm md:text-2xl"
              onChange={(e) => {
                setQuantity(e.target.value);
              }}
              onBlur={(e) => {
                if (e.target.value === "") setQuantity("0");
              }}
              value={quantity}
            />
            {quantity === "0" && <span>Item will be removed</span>}
          </p>
        </div>
      </div>
    </li>
  );
}
