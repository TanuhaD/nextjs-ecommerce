import { Product } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import PriceTag from "../PriceTag";

interface AdminProductCardProps {
  product: Product;
}

export default function AdminProductCard({ product }: AdminProductCardProps) {
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() <
    1000 * 60 * 60 * 24 * 7;

  return (
    <Link
      href={`/dashboard/product/${product.id}`}
      className="card w-full bg-base-100 transition-shadow hover:shadow-xl"
    >
      <Image
        src={product.imageUrl || "/no-image-placeholder.png"}
        alt={product.name}
        width={720}
        height={100}
        className="h-48 object-cover"
      />
      <div className="card-body">
        <h2 className="card-title">
          {product.name}
          {isNew && <div className="badge badge-secondary">NEW</div>}
        </h2>
        <p className="break-words font-medium  ">{product.description}</p>
        <PriceTag price={product.price} />
      </div>
    </Link>
  );
}
