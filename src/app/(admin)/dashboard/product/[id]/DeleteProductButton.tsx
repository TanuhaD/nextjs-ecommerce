"use client";

import { deleteProductByIdRequest, deleteProductByIdResponse } from "@/app/api/delete-product-by-id/route";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface DeleteProductButtonProps {
  productId: string | null;
}

const MySwal = withReactContent(Swal);
export default function DeleteProductButton({ productId }: DeleteProductButtonProps): JSX.Element {
  const router = useRouter();

  const handleDeleteProductBtn = async () => {
    let request: deleteProductByIdRequest;
    request = {
      productId,
    };
    const fetchResponse = await fetch("/api/delete-product-by-id", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });
    if (fetchResponse.ok) {
      MySwal.fire({
        title: "Deleted!",
        text: "Your product has been deleted.",
        icon: "success",
      }).then(() => {
        router.push("/dashboard");
      });
    } else {
      const { message } = (await fetchResponse.json()) as deleteProductByIdResponse;
      MySwal.fire({
        title: "Error",
        text: "Error deleting product: " + message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const hundleClickBtn = () => {
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
      }
    });
  };

  return (
    <div className="mt-3 flex items-center gap-2">
      <button className="btn btn-primary shadow-md hover:shadow-xl" onClick={hundleClickBtn}>
        Delete Product
      </button>
    </div>
  );
}
