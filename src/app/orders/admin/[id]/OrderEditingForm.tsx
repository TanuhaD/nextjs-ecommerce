"use client";

import { GetOrderByIdResult } from "@/lib/db/order";
import Image from "next/image";

interface OrderEditingFormProps {
  orderResult: GetOrderByIdResult;
}

export default function OrderEditingForm({
  orderResult: { order, error },
}: OrderEditingFormProps) {
  if (error) {
    return <div>{error}</div>;
  }
  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className=" mb-6  rounded-md border-2 border-solid  border-primary bg-slate-100 p-4 shadow-md ">
      <h1 className=" mb-6 rounded-md border p-2 pt-3  text-center font-bold text-info  shadow-md sm:text-xl md:text-3xl">
        Order {order.id}
      </h1>
      <div className="mb-4 gap-6  rounded-md border p-4  shadow-md">
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl ">
          Name: {order.name}
        </p>
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl ">
          Phone: {order.phone}{" "}
        </p>
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl ">
          Adress: {order.address}
        </p>
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl ">
          Comments: {order.comments}
        </p>
      </div>
      <ul>
        {order.items.map((item) => {
          return (
            <li
              key={item.id}
              className="mb-3 rounded-md border-2 border-solid border-gray-300 p-3 "
            >
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
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col  justify-center gap-4 p-4 font-semibold">
        <p className="font-bold sm:text-sm md:text-2xl">
          Total: {order.total / 100} $
        </p>
        <p className="font-bold sm:text-sm md:text-2xl">
          Created: {order.createdAt.getDate()}.{order.createdAt.getMonth()}.
          {order.createdAt.getFullYear()}
        </p>
        <p className="font-bold sm:text-sm md:text-2xl">
          Status: {order.status}
        </p>
      </div>
      <div className="flex justify-end">
        <button className="btn-primary btn ">Change order</button>
      </div>
    </div>
  );
}
