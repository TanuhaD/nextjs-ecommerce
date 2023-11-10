"use client";
import { useEffect, useState } from "react";
// @ts-ignore
import { useFormState, useFormStatus } from "react-dom";
import { addProduct } from "./actions";

const initialState = {
  result: null,
  error: null,
};

export const AddProductForm: React.FC = () => {
  const [state, formAction] = useFormState(addProduct, initialState);
  const { pending } = useFormStatus();
  const [linkValue, setLinkValue] = useState("");
  const [fileValue, setFileValue] = useState<File | null>(null);

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
    console.log(state);
  }, [state]);

  return (
    <form action={formAction}>
      <input
        required
        name="name"
        placeholder="Name"
        className="input-bordered input mb-3 w-full shadow-md"
      />
      <textarea
        required
        name="description"
        placeholder="Description"
        className="textarea-bordered textarea mb-3 w-full shadow-md"
      />
      <input
        name="imageLink"
        value={linkValue}
        onChange={handleLinkChange}
        disabled={fileValue !== null}
        placeholder="Image Link"
        type="url"
        className="input-bordered input mb-3 w-full shadow-md"
      />
      <input
        name="imageFile"
        onChange={handleFileChange}
        disabled={linkValue !== ""}
        className="file-input-bordered file-input-warning file-input mb-3 mr-7 w-full max-w-xs"
        type="file"
        accept="image/*"
      />
      <button
        className="btn-primary btn shadow-md hover:shadow-xl"
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
        className="input-bordered input mb-3 w-full shadow-md "
      />
      <button
        className={`btn-primary btn-block btn shadow-md hover:shadow-xl`}
        type="submit"
        disabled={pending}
      >
        {pending && <span className="loading loading-spinner" />}
        Add poduct
      </button>
    </form>
  );
};
