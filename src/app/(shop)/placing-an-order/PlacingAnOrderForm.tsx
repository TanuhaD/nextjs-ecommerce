"use client";
import { useEffect } from "react";
import { MySwal } from "@/lib/sweet-alert";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { useFormValidationHook } from "./useFormValidationHook";
import { PlaceOrderResult } from "./action";

const initialState: PlaceOrderResult = {
  validationErrors: null,
  result: null,
  error: null,
};

export const PlacingAnOrderForm: React.FC<{
  action: (_: any, formData: FormData) => Promise<PlaceOrderResult>;
}> = ({ action }) => {
  const [state, formAction] = useFormState(action, initialState);

  const { pending } = useFormStatus();
  const router = useRouter();
  const {
    nameValidationMessage,
    emailValidationMessage,
    phoneValidationMessage,
    addressValidationMessage,
    commentsValidationMessage,
    removeValidationMessage,
  } = useFormValidationHook(state);

  useEffect(() => {
    const result = state?.result || "";

    if (result === "CREATED") {
      MySwal.fire({
        icon: "success",
        title: `Product ${result.toLowerCase()} successfully`,
        confirmButtonText: "OK",
      }).then(() => {
        router.push(`/orders`);
      });
    } else if (result === "FAIL" && !state?.validationErrors) {
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
        <label className="form-control mb-3">
          <input
            onChange={() => removeValidationMessage("name")}
            required
            name="name"
            autoComplete="name"
            placeholder="Name"
            type="text"
            className="input input-bordered  w-full shadow-md"
          />
          <div className="label">
            {nameValidationMessage && (
              <span className="label-text-alt text-red-700">{nameValidationMessage}</span>
            )}
          </div>
        </label>

        <label className="form-control mb-3">
          <input
            onChange={() => removeValidationMessage("phone")}
            required
            name="phone"
            autoComplete="phone"
            type="text"
            placeholder="Phone"
            className="input input-bordered  w-full shadow-md"
          />
          <div className="label">
            {phoneValidationMessage && (
              <span className="label-text-alt text-red-700">{phoneValidationMessage}</span>
            )}
          </div>
        </label>
        <label className="form-control mb-3">
          <input
            onChange={() => removeValidationMessage("email")}
            name="email"
            placeholder="Email"
            type="text"
            className="input input-bordered  w-full shadow-md"
          />
          <div className="label">
            {emailValidationMessage && (
              <span className="label-text-alt text-red-700">{emailValidationMessage}</span>
            )}
          </div>
        </label>
        <label className="form-control mb-3">
          <input
            onChange={() => removeValidationMessage("address")}
            name="address"
            placeholder="Address"
            className="input input-bordered  w-full shadow-md"
            type="text"
          />
          <div className="label">
            {addressValidationMessage && (
              <span className="label-text-alt text-red-700">{addressValidationMessage}</span>
            )}
          </div>
        </label>
        <label className="form-control mb-3">
          <textarea
            name="comments"
            placeholder="Comments on the order"
            className="textarea textarea-bordered mb-3 w-full shadow-md"
          />
          <div className="label">
            {commentsValidationMessage && (
              <span className="label-text-alt text-red-700">{commentsValidationMessage}</span>
            )}
          </div>
        </label>

        <button
          className={`btn btn-primary btn-block shadow-md hover:shadow-xl`}
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
