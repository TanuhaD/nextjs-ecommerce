"use client";

import { GetOrderByIdResult } from "@/lib/db/order";
import { useEffect, useMemo, useState } from "react";
import OrderInfoProduct from "./change-order/OrderInfoProduct";

interface OrderEditingFormProps {
  orderResult: GetOrderByIdResult;
}

export default function OrderEditingForm({
  orderResult: { order, error },
}: OrderEditingFormProps) {
  const [orderItems, setOrderItems] = useState(order?.items || []);
  const [name, setName] = useState(order?.name || "");
  const [phone, setPhone] = useState(order?.phone || "");
  const [adress, setAdress] = useState(order?.address || "");
  const [comments, setComments] = useState(order?.comments || "");

  useEffect(() => {
    console.log(orderItems);
  }, [orderItems]);

  const handleItemsQuantityChange = useMemo(
    () =>
      ({ itemId, newQuantity }: { itemId: string; newQuantity: string }) => {
        console.log("newQuantity", newQuantity);
        setOrderItems((prev) => {
          const newOrders = prev.map((order) =>
            order.id === itemId
              ? { ...order, quantity: parseInt(newQuantity) || 0 }
              : order
          );
          return newOrders;
        });
      },
    []
  );

  if (error) {
    return <div>{error}</div>;
  }
  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className=" mb-6  rounded-md border-2 border-solid  border-primary bg-slate-50 p-4 shadow-md ">
      <h1 className=" mb-6 rounded-md border p-2 pt-3  text-center font-bold text-info  shadow-md sm:text-xl md:text-3xl">
        Order {order.id}
      </h1>
      <div className="mb-4 gap-6  rounded-md border p-4  shadow-md">
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl ">
          Name:{" "}
          <input
            type="text"
            className="input-ghost input w-full max-w-xs sm:text-sm md:text-2xl"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        </p>
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl ">
          Phone:
          <input
            type="text"
            className="input-ghost input w-full max-w-xs sm:text-sm md:text-2xl"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            value={phone}
          />
        </p>
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl ">
          Adress:
          <input
            type="text"
            className="input-ghost input w-full max-w-xs sm:text-sm md:text-2xl"
            onChange={(e) => {
              setAdress(e.target.value);
            }}
            value={adress}
          />
        </p>
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl ">
          Comments: {order.comments}
          <input
            type="text"
            className="input-ghost input w-full max-w-xs sm:text-sm md:text-2xl"
            onChange={(e) => {
              setComments(e.target.value);
            }}
            value={comments}
          />
        </p>
      </div>
      <ul>
        {order.items.map((item) => {
          return (
            <OrderInfoProduct
              key={item.id}
              item={item}
              quantityChangeHandler={handleItemsQuantityChange}
            />
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
