"use client";

import { revalidatePath } from "next/cache";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface DeleteProductButtonProps {
  productId: string;
  userId: string;
}
const MySwal = withReactContent(Swal);
export default function DeleteProductButton({
  productId,
  userId,
}: DeleteProductButtonProps): JSX.Element {
  const handleDeleteProductBtn = async () => {
    const response = await fetch("/api/delete-product-by-id", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, userId }),
    });
    if (!response.ok) {
      MySwal.fire({
        title: "Error",
        text: "Error deleting product",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        className="btn-primary btn shadow-md hover:shadow-xl"
        onClick={() => {
          MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then((result) => {
            if (result.isConfirmed) {
              handleDeleteProductBtn();
              MySwal.fire({
                title: "Deleted!",
                text: "Your product has been deleted.",
                icon: "success",
              });
            }
          });
        }}
      >
        Delete Product
      </button>
    </div>
  );
}
