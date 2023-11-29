"use client";
import { MySwal } from "@/lib/sweet-alert";
import { EditUpdateServerActionResponse } from "@/types/edit-update-server-action-response";
import { ProductType } from "@/types/product";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

const initialState: EditUpdateServerActionResponse = {
  result: null,
  error: null,
  prismaResult: null,
};

type Action = (
  prevState: any,
  formData: FormData,
) => Promise<EditUpdateServerActionResponse>;

interface AddUpdateProductFormProps {
  action: Action;
  productInfo?: ProductType;
}

export const AddUpdateProductForm: React.FC<AddUpdateProductFormProps> = ({
  action,
  productInfo,
}) => {
  const [state, formAction] = useFormState(action, initialState);
  const { pending } = useFormStatus();
  const [linkValue, setLinkValue] = useState(productInfo?.imageUrl || "");
  const [fileValue, setFileValue] = useState<File | null>(null);
  const router = useRouter();

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkValue(e.target.value);
    setFileValue(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileValue(e.target.files[0]);
      setLinkValue("");
    } else {
      setFileValue(null);
    }
  };

  const clearImageInputs = () => {
    setLinkValue("");
    setFileValue(null);
  };

  useEffect(() => {
    const result = state.result || "";
    if (result === "CREATED" || result === "UPDATED") {
      MySwal.fire({
        icon: "success",
        title: `Product ${result.toLowerCase()} successfully`,
        confirmButtonText: "OK",
      }).then(() => {
        if (state.prismaResult?.id) {
          router.push(`/dashboard/product/${state.prismaResult.id}}`);
        } else {
          router.push(`/dashboard`);
        }
      });
    } else if (result === "FAIL") {
      MySwal.fire({
        icon: "error",
        title: "Error. Please try again.",
        text: state.error || "Something went wrong",
        confirmButtonText: "OK",
      });
    }
  }, [productInfo?.id, router, state]);

  return (
    <form action={formAction}>
      {productInfo?.id && (
        <input type="hidden" name="productId" value={productInfo?.id} />
      )}
      <input
        required
        name="name"
        placeholder="Name"
        className="input input-bordered mb-3 w-full shadow-md"
        defaultValue={productInfo?.name}
      />
      <textarea
        required
        name="description"
        placeholder="Description"
        className="textarea textarea-bordered mb-3 w-full shadow-md"
        defaultValue={productInfo?.description}
      />
      <input
        name="oldImageLink"
        type="hidden"
        defaultValue={productInfo?.imageUrl}
      />
      <input
        name="imageLink"
        value={linkValue}
        onChange={handleLinkChange}
        disabled={fileValue !== null}
        placeholder="Image Link"
        type="url"
        className="input input-bordered mb-3 w-full shadow-md"
      />
      <input
        name="imageFile"
        onChange={handleFileChange}
        disabled={linkValue !== ""}
        className="file-input file-input-bordered file-input-warning mb-3 mr-7 w-full max-w-xs"
        type="file"
        accept="image/*"
      />
      <button
        className="btn btn-primary shadow-md hover:shadow-xl"
        type="button"
        onClick={clearImageInputs}
      >
        Clear
      </button>
      <input
        required
        name="price"
        placeholder="Price"
        type="number"
        className="input input-bordered mb-3 w-full shadow-md "
        defaultValue={productInfo?.price}
      />
      <button
        className={`btn btn-primary btn-block shadow-md hover:shadow-xl`}
        type="submit"
        disabled={pending}
      >
        {pending && <span className="loading loading-spinner" />}
        {productInfo?.id ? "Update" : "Add"} poduct
      </button>
    </form>
  );
};
