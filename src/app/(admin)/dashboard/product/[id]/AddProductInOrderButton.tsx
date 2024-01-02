"use client";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useRouter } from "next/navigation";
import { useAdminOrderContext } from "../../orders/AdminOrderContext";
import { addProductToOrderResponse } from "@/app/api/add-product-to-order/route";

interface AddProductInOrderButtonProps {
  productId: string;
}

const MySwal = withReactContent(Swal);

export default function AddProductInOrderButton({
  productId,
}: AddProductInOrderButtonProps) {
  const { orderId } = useAdminOrderContext();
  const router = useRouter();
  const handleAddProductInOrder = async () => {
    try {
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

      const updatedOrderData =
        (await response.json()) as addProductToOrderResponse;

      if (!updatedOrderData.order?.id) {
        return MySwal.fire({
          icon: "error",
          title: "Failed to add product to order",
          confirmButtonText: "OK",
        });
      }

      MySwal.fire({
        icon: "success",
        title: "Product added to order successfully!",
        confirmButtonText: "OK",
      }).then(() => {
        router.push(`/dashboard/orders/${updatedOrderData.order?.id}`);
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
