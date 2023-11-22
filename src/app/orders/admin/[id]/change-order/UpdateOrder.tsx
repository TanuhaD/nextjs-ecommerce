"use client";

import { EditUpdateServerActionResponseOrder } from "@/types/edit-update-server-action-response";
// @ts-ignore
import { useFormState, useFormStatus } from "react-dom";
import { MySwal } from "@/lib/sweet-alert";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrderWithProductsType } from "./page";

const initialState: EditUpdateServerActionResponseOrder = {
  result: null,
  error: null,
  prismaResultOrder: null,
};

export const UpdateOrder: React.FC<{
  action: (
    prevState: any,
    formData: FormData
  ) => Promise<{
    result: string | null;
    error: string | null;
  }>;
  orderInfo?: OrderWithProductsType;
}> = ({ action, orderInfo }) => {
  const [state, formAction] = useFormState(action, initialState);
  const { pending } = useFormStatus();
  const router = useRouter();
  useEffect(() => {
    const result = state.result || "";
    if (result === "CREATED" || result === "UPDATED") {
      MySwal.fire({
        icon: "success",
        title: `Product ${result.toLowerCase()} successfully`,
        confirmButtonText: "OK",
      }).then(() => {
        router.push(`/orders/admin/${state.prismaResultOrder?.id}`);
      });
    } else if (result === "FAIL") {
      MySwal.fire({
        icon: "error",
        title: "Error. Please try again.",
        text: state.error || "Something went wrong",
        confirmButtonText: "OK",
      });
    }
  }, [router, state]);

  return (
    <form action={formAction}>
      {!orderInfo && <p>No order information available.</p>}

      {orderInfo?.id && (
        <input type="hidden" name="order" value={orderInfo?.id} />
      )}
      <input
        name="name"
        placeholder="Name"
        className="input-bordered input mb-3 w-full shadow-md"
        defaultValue={orderInfo?.name || ""}
      />

      <input
        name="phone"
        placeholder="Phone"
        className="input-bordered input mb-3 w-full shadow-md"
        defaultValue={orderInfo?.phone || ""}
      />
      <input
        name="adress"
        placeholder="Adress"
        className="input-bordered input mb-3 w-full shadow-md"
        defaultValue={orderInfo?.address || ""}
      />
      <input
        name="comments"
        placeholder="Comments"
        className="file-input-bordered file-input-warning file-input mb-3 mr-7 w-full max-w-xs"
        defaultValue={orderInfo?.comments || ""}
      />

      <input
        name="nameProduct"
        placeholder="Name-Product"
        type="number"
        className="input-bordered input mb-3 w-full shadow-md "
        defaultValue={orderInfo?.items[0].product.name}
      />
      <input
        name="price"
        placeholder="Price"
        type="number"
        className="input-bordered input mb-3 w-full shadow-md "
        defaultValue={orderInfo?.items[0].product.price}
      />
      <input
        name="quantity"
        placeholder="Quantity"
        type="number"
        className="input-bordered input mb-3 w-full shadow-md "
        defaultValue={orderInfo?.items[0].quantity}
      />
      <input
        name="totall"
        placeholder="Totall"
        className="input-bordered input mb-3 w-full shadow-md"
        defaultValue={orderInfo?.total}
      />
      <input
        name="status"
        placeholder="Status"
        className="input-bordered input mb-3 w-full shadow-md"
        defaultValue={orderInfo?.status}
      />
      <button
        className={`btn-primary btn-block btn shadow-md hover:shadow-xl`}
        type="submit"
        disabled={pending}
      >
        {" "}
        {pending && <span className="loading loading-spinner" />}Update
      </button>
    </form>
  );
};
