"use client";
import { useEffect, useState } from "react";
import { MySwal } from "@/lib/sweet-alert";

import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { ZodError, z } from "zod";

export interface validationFields {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  comments?: string;
}

const initialState = {
  result: null,
  error: null,
  prismaResult: null,
};

const schema = z.object({
  name: z.string().min(3),
  phone: z.string().min(3),
  email: z.string().email(),
  address: z.string().min(3),
  comments: z.string().max(1000),
});

export const PlacingAnOrderForm: React.FC<{
  action: (
    _: any,
    formData: FormData,
  ) => Promise<{
    result: string | null;
    error: string | null;
  }>;
}> = ({ action }) => {
  const [state, formAction] = useFormState(action, initialState);
  const [nameError, setNameError] = useState("");
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

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    try {
      schema.parse(formValues);
    } catch (e) {
      event.preventDefault();
      const error = e as z.ZodError;
      const validationErrors: validationFields = {};
      error.errors.forEach((err) => {
        const field = err.path.join(".") as keyof validationFields;
        validationErrors[field] = err.message;
      });
      if (validationErrors.name) {
        setNameError(validationErrors.name);
      }
    }
  };
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameError("");
  };
  return (
    <div className=" flex justify-center">
      <form
        onSubmit={handleFormSubmit}
        className="max-w-md"
        action={formAction}
      >
        <label className="form-control mb-3">
          <input
            onChange={handleNameChange}
            required
            name="name"
            placeholder="Name"
            type="text"
            className="input input-bordered  w-full shadow-md"
          />
          <div className="label">
            <span className="label-text-alt text-red-700">{nameError}</span>
          </div>
        </label>

        <input
          required
          name="phone"
          type="text"
          placeholder="Phone"
          className="input input-bordered mb-3 w-full shadow-md"
        />
        <input
          name="email"
          placeholder="Email"
          type="text"
          className="input input-bordered mb-3 w-full shadow-md"
        />
        <input
          name="address"
          placeholder="Address"
          className="input input-bordered mb-3 w-full shadow-md"
          type="text"
        />
        <textarea
          name="comments"
          placeholder="Comments on the order"
          className="textarea textarea-bordered mb-3 w-full shadow-md"
        />

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
