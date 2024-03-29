"use client";

import { GetOrderByIdResult } from "@/lib/db/order";
import { useContext, useEffect, useMemo, useState } from "react";
import OrderInfoProduct from "./OrderInfoProduct";
import { MySwal } from "@/lib/sweet-alert";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminOrderContext } from "../AdminOrderContext";
import { orderEditingFormRequest, orderEditingFormResponse } from "@/app/api/update-order-admin/route";

interface OrderEditingFormProps {
  orderResult: GetOrderByIdResult;
}

export default function OrderEditingForm({ orderResult: { order, error } }: OrderEditingFormProps) {
  const [orderItems, setOrderItems] = useState(order?.items || []);
  const [name, setName] = useState(order?.name || "");
  const [phone, setPhone] = useState(order?.phone || "");
  const [address, setAddress] = useState(order?.address || "");
  const [comments, setComments] = useState(order?.comments || "");
  const [total, setTotal] = useState(order?.total || 0);
  const [status, setStatus] = useState(order?.status || "");
  const isCompleted = status === "Completed";
  const router = useRouter();
  const { orderId, mySetOrderId } = useAdminOrderContext();

  useEffect(() => {
    setTotal(
      orderItems.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0),
    );
  }, [orderItems]);

  const handleItemsQuantityChange = ({ itemId, newQuantity }: { itemId: string; newQuantity: string }) => {
    setOrderItems((prev) => {
      const newOrders = prev.map((order) =>
        order.id === itemId ? { ...order, quantity: parseInt(newQuantity) || 0 } : order,
      );
      return newOrders;
    });
  };

  const handleOrderChange = async () => {
    const newOrder: orderEditingFormRequest = {
      ...order,
      id: order?.id!,
      items: orderItems,
      name,
      phone,
      address: address,
      comments,
      total,
      status,
    };
    const result = await fetch("/api/update-order-admin", {
      method: "POST",
      body: JSON.stringify(newOrder),
    });
    const data = (await result.json()) as orderEditingFormResponse;
    if (data.orderId) {
      MySwal.fire({
        icon: "success",
        title: `Order ${data.orderId} updated successfully`,
        confirmButtonText: "OK",
      }).then(() => {
        router.refresh();
      });
    } else {
      MySwal.fire({
        icon: "error",
        title: `Order ${data.orderId} not updated`,
        text: data.message,
        confirmButtonText: "OK",
      });
    }
  };

  if (error) {
    return <div>{error}</div>;
  }
  if (!order) {
    return <div>Order not found</div>;
  }

  const handleAddProduct = () => {
    if (mySetOrderId) {
      mySetOrderId(order.id);
      router.replace("/dashboard");
    }
  };

  return (
    <div className=" mb-6  rounded-md border-2 border-solid  border-primary bg-slate-50 p-4 shadow-md ">
      <h1 className=" mb-6 rounded-md border p-2 pt-3  text-center font-bold text-info  shadow-md sm:text-xs md:text-2xl">
        Order {order.id || orderId}
      </h1>
      <div className="mb-4 gap-6  rounded-md border p-4  shadow-md">
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-xl ">
          Name:{" "}
          <input
            type="text"
            className="input input-ghost ml-2 w-full max-w-xs sm:text-sm md:text-xl"
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            disabled={isCompleted}
          />
        </p>
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-xl ">
          Phone:
          <input
            type="text"
            className="input input-ghost ml-2 w-full max-w-xs sm:text-sm md:text-xl"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            value={phone}
            disabled={isCompleted}
          />
        </p>
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-xl ">
          Address:
          <input
            type="text"
            className="input input-ghost ml-2 w-full max-w-xs sm:text-sm md:text-2xl"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            value={address}
            disabled={isCompleted}
          />
        </p>
        <p className=" border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-xl ">
          Comments:
          <input
            type="text"
            className="input input-ghost ml-2 w-full max-w-xs sm:text-sm md:text-xl"
            onChange={(e) => {
              setComments(e.target.value);
            }}
            value={comments}
            disabled={isCompleted}
          />
        </p>
      </div>
      <ul>
        {order.items.map((item) => {
          return (
            <OrderInfoProduct
              key={item.id}
              item={item}
              status={status}
              quantityChangeHandler={handleItemsQuantityChange}
            />
          );
        })}
      </ul>
      <div className="flex items-center gap-4 rounded-md border border-warning p-6 shadow-md sm:flex-col md:mb-4 md:mt-4 md:flex-row">
        <p className=" font-bold sm:text-sm md:text-xl">Add a new product to the order</p>
        <button
          className="btn btn-primary p-4 font-bold shadow-md"
          onClick={handleAddProduct}
          disabled={isCompleted}
        >
          Add
        </button>
      </div>
      <div className="flex flex-col  justify-center gap-4 p-4 font-semibold">
        <p className="font-bold sm:text-sm md:text-xl">Total: {total / 100} $</p>
        <p className="font-bold sm:text-sm md:text-xl">
          Created: {order.createdAt.getDate()}.{order.createdAt.getMonth()}.{order.createdAt.getFullYear()}
        </p>
        <p className="font-bold sm:text-sm md:text-xl">
          Status:
          <select
            className="select select-ghost mb-3 ml-3 mt-3 w-full max-w-xs rounded-md border  border-warning sm:text-sm md:text-xl"
            defaultValue={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Pending</option>
            <option>Processing</option>
            <option>Dispatched</option>
            <option>Delivered</option>
            <option>Canceled</option>
            <option>Refunded</option>
            <option>Returned</option>
            <option>Completed</option>
          </select>
        </p>
      </div>
      <div className="flex justify-end">
        <button onClick={handleOrderChange} className="btn btn-primary shadow-md ">
          Save order
        </button>
      </div>
    </div>
  );
}
