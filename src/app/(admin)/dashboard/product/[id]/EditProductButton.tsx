"use client";
import Link from "next/link";
interface EditProductButtonProps {
  productId: string;
}

export default function EditProductButton({
  productId,
}: EditProductButtonProps): JSX.Element {
  return (
    <div className="mt-3 flex items-center gap-2">
      <Link
        className="btn-primary btn shadow-md hover:shadow-xl"
        href={`/dashboard/edit-product/${productId}`}
      >
        Edit Product
      </Link>
    </div>
  );
}
