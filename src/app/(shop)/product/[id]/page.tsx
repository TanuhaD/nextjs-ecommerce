import PriceTag from "@/components/PriceTag";
import { GetCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddCartButton from "./AddCartButton";
import { incrementProductQuantity } from "./action";
import { env } from "@/lib/env";

interface ProductPageProps {
  params: {
    id: string;
  };
}
type Props = {
  params: { id: string };
};

const getProduct = async (id: string) => {
  let product;
  try {
    product = await prisma.product.findUnique({ where: { id } });
  } catch (error) {}
  if (!product) {
    notFound();
  }
  return product;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const product = await getProduct(id);
  return {
    metadataBase: new URL(env.BASE_URL),
    title: product.name,
    description: product.description,
    openGraph: {
      images: [{ url: product.imageUrl }],
    },
  };
}

const ProductPage: React.FC<ProductPageProps> = async ({ params: { id } }) => {
  const product = await getProduct(id);
  const cart = await GetCart();

  let isProductInCart = false;
  if (cart) {
    isProductInCart = cart.items.some(
      (item) => item.productId === id,
    ) as boolean;
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <Image
        src={product.imageUrl || "/no-image-placeholder.png"}
        alt={product.name}
        width={500}
        height={500}
        className="rounded-lg"
        priority
      ></Image>
      <div>
        <h1 className="text-5xl font-bold">{product.name}</h1>
        <PriceTag price={product.price} className="mt-4" />
        <p className="py-6">{product.description}</p>
        <AddCartButton
          productId={product.id}
          incrementProductQuantity={incrementProductQuantity}
          isProductInCart={isProductInCart}
        />
      </div>
    </div>
  );
};

export default ProductPage;
