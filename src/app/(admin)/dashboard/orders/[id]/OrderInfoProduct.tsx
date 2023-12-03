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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value);
    quantityChangeHandler({
      newQuantity: e.target.value,
      itemId: item.id,
    });
  };
  return (
    <li className="mb-3 rounded-md border-2 border-solid border-gray-300 p-3 shadow-md ">
      <div className="flex items-center gap-4 sm:flex-col sm:items-start md:flex-row  ">
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
          <p className=" flex flex-row items-center font-medium sm:text-sm md:text-2xl">
            Quantity:
            <input
              type="number"
              className="input  input-ghost ml-2   max-w-[100px] sm:text-sm md:text-2xl"
              onChange={handleQuantityChange}
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
