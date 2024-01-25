"use client";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { useRouter } from "next/navigation";
import { useAdminOrderContext } from "../../orders/AdminOrderContext";
import { addProductToOrderRequest, addProductToOrderResponse } from "@/app/api/add-product-to-order/route";
import { revalidatePath } from "next/cache";

interface AddProductInOrderButtonProps {
  productId: string;
}

const MySwal = withReactContent(Swal);

export default function AddProductInOrderButton({ productId }: AddProductInOrderButtonProps) {
  const { orderId } = useAdminOrderContext();
  const router = useRouter();
  const handleAddProductInOrder = async () => {
    try {
      const request: addProductToOrderRequest = {
        orderId,
        productId,
      };
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

      const updatedOrderData = (await response.json()) as addProductToOrderResponse;

      if (!updatedOrderData.orderId) {
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
        router.push(`/dashboard/orders/${updatedOrderData.orderId}`);
        router.refresh();
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
    <>
      {orderId ? (
        <button
          className="btn btn-primary flex h-auto flex-col items-center justify-center p-3 shadow-md hover:shadow-xl"
          onClick={handleAddProductInOrder}
        >
          <span>Add product in order</span>
          <span>№ {orderId}</span>
        </button>
      ) : null}
    </>
  );
}
