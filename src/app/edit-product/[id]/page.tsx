import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { updateProduct } from "./action";
import { AddUpdateProductForm } from "@/components/AddUpdateProductForm";

interface ProductPageProps {
  params: {
    id: string;
  };
}
export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: "Edit Product Flowmazon",
};

export default async function EditProductPage({
  params: { id },
}: ProductPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  } else if (session.user.role !== "ADMIN") {
    redirect("/forbidden");
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });
  if (!product) redirect("/add-product");
  return (
    <div>
      <h1 className="mb-3 text-center text-lg font-bold">Edit product</h1>
      <AddUpdateProductForm action={updateProduct} productInfo={product} />
    </div>
  );
}
