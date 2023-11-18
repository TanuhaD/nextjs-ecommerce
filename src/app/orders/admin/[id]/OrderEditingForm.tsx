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

  console.log(order);
  return (
    <div className="mb-6 rounded-md border p-4  shadow-md ">
      <h2 className=" mb-6 rounded-md border p-2 pt-3  text-center font-bold text-info  sm:text-xl md:text-3xl">
        Order {order.id}
      </h2>
      <div className="mb-4 gap-4 p-4">
        <p className="font-medium">Name: {order.name}</p>
        <p className="font-medium">Phone: {order.phone} </p>
        <p className="font-medium">Adress: {order.address}</p>
        <p className="font-medium">Comments: {order.comments}</p>
      </div>
      <ul>
        {order.items.map((item) => {
          return (
            <li
              key={item.id}
              className="mb-3 rounded-md border-2 border-solid border-gray-300 p-3 "
            >
              <div className="flex gap-4 sm:flex-col  ">
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
                  <p className="font-medium text-info">{item.product.name}</p>
                  <p className="font-medium">Price: {item.price / 100} $</p>
                  <p className="font-medium">Quantity: {item.quantity}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col items-end justify-center gap-4 p-4 font-semibold">
        <p>Total: {order.total / 100} $</p>
        <p className="">
          Created: {order.createdAt.getDate()}.{order.createdAt.getMonth()}.
          {order.createdAt.getFullYear()}
        </p>
        <p>Status: {order.status}</p>
      </div>
      <button className="btn-primary btn">Change order</button>
    </div>
  );
}
