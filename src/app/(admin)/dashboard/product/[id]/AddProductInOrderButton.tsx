"use client";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AdminOrderContext } from "../../orders/AdminOrderContext";
import { useRouter } from "next/navigation";
interface AddProductInOrderButtonProps {
  productId: string;
}

const MySwal = withReactContent(Swal);

export default function AddProductInOrderButton({
  productId,
}: AddProductInOrderButtonProps) {
  const { orderId, setOrderId } = useContext(AdminOrderContext) || {};
  console.log("orderId", orderId);
  const router = useRouter();
  const handleAddProductInOrder = async () => {
    try {
      console.log("orderId before fetch:", orderId);

      const response = await fetch("/api/add-product-to-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          productId,
        }),
      });

      // if (!response.ok) {
      //   throw new Error("Failed to add product to order");
      // }

      const updatedOrderData = await response.json();
      console.log("updatedOrderData", updatedOrderData);

      if (!updatedOrderData.order.id) {
        return MySwal.fire({
          icon: "error",
          title: "Failed to add product to order",
          confirmButtonText: "OK",
        });
      }

      setOrderId && setOrderId(updatedOrderData.order.id);

      MySwal.fire({
        icon: "success",
        title: "Product added to order successfully!",
        confirmButtonText: "OK",
      }).then(() => {
        router.push(`/dashboard/orders/${updatedOrderData.order.id}`);
      });
    } catch (error) {
      console.error("Error adding product to order:", error);

      MySwal.fire({
        icon: "error",
        title: "Failed to add product to order",
        confirmButtonText: "OK",
      });
    }
  };
  return (
    <button
      className="btn btn-primary shadow-md hover:shadow-xl"
      onClick={handleAddProductInOrder}
    >
      Add product in order
    </button>
  );
}
