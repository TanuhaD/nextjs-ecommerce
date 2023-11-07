"use client";

interface DeleteProductButtonProps {
  productId: string;
  userId: string;
  deleteProductId: (productId: string, userId: string) => Promise<void>;
}

export default function DeleteProductButton({
  productId,
  userId,
  deleteProductId,
}: DeleteProductButtonProps): JSX.Element {
  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        className="btn-primary btn"
        onClick={async () => await deleteProductId(productId, userId)}
      >
        Delete Product
      </button>
    </div>
  );
}
