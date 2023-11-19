"use client";
import { useEffect } from "react";
import { MySwal } from "@/lib/sweet-alert";
// @ts-ignore
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

const initialState = {
  result: null,
  error: null,
  prismaResult: null,
};
export const PlacingAnOrderForm: React.FC<{
  action: (
    _: any,
    formData: FormData
  ) => Promise<{
    result: string | null;
    error: string | null;
  }>;
}> = ({ action }) => {
  const [state, formAction] = useFormState(action, initialState);
  const { pending } = useFormStatus();
  const router = useRouter();
  useEffect(() => {
    const result = state.result || "";

    if (result === "CREATED") {
      MySwal.fire({
        icon: "success",
        title: `Product ${result.toLowerCase()} successfully`,
        confirmButtonText: "OK",
      }).then(() => {
        router.push(`/orders`);
      });
    } else if (result === "FAIL") {
      MySwal.fire({
        icon: "error",
        title: "Error. Please try again.",
        text: "Error:Your order has not been sent ",
        confirmButtonText: "OK",
      });
    }
  }, [state, router]);
  return (
    <div className=" flex justify-center">
      <form className="max-w-md" action={formAction}>
        <input
          required
          name="name"
          placeholder="Name"
          type="text"
          className="input-bordered input mb-3 w-full shadow-md"
        />

        <input
          required
          name="phone"
          type="text"
          placeholder="Phone"
          className="input-bordered input mb-3 w-full shadow-md"
        />
        <input
          name="email"
          placeholder="Email"
          type="text"
          className="input-bordered input mb-3 w-full shadow-md"
        />
        <input
          name="address"
          placeholder="Address"
          className="input-bordered input mb-3 w-full shadow-md"
          type="text"
        />
        <textarea
          name="comments"
          placeholder="Comments on the order"
          className="textarea-bordered textarea mb-3 w-full shadow-md"
        />

        <button
          className={`btn-primary btn-block btn shadow-md hover:shadow-xl`}
          type="submit"
          disabled={pending}
        >
          Checkout
        </button>
        {pending && <span className="loading loading-spinner" />}
      </form>
    </div>
  );
};
