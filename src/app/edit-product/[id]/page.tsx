import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface ProductPageProps {
  params: {
    id: string;
  };
}
export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: "Edit Product Flowmazon",
};

async function editProduct(productId: string, formData: FormData) {
  "use server";

  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  } else if (session.user.role !== "ADMIN") {
    redirect("/forbidden");
  }
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);
  if (!name || !description || !imageUrl || !price) {
    throw new Error("Missing property");
  }
  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      imageUrl,
      price,
    },
  });
  revalidatePath("/product/[id]");
  redirect("/product/" + productId);
}

export default async function EditProductPage({
  params: { id },
}: ProductPageProps) {
  const editProductWithId = editProduct.bind(null, id);
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

      <form action={editProductWithId}>
        <label className="label mb-2 flex flex-col items-start ">
          <span className="font-bold">Name</span>
          <input
            required
            name="name"
            placeholder="Name"
            className="input-bordered input mt-2  w-full"
            defaultValue={product.name}
          />
        </label>
        <label className="label mb-2 flex flex-col items-start  ">
          <span className="font-bold">Description</span>
          <textarea
            required
            name="description"
            placeholder="Description"
            className="textarea-bordered textarea mt-2 w-full"
            defaultValue={product.description}
          />
        </label>
        <label className="label mb-2 flex flex-col items-start  ">
          <span className="font-bold"> Image Url</span>
          <input
            required
            name="imageUrl"
            placeholder="Image Url"
            type="url"
            className="input-bordered input mt-2 w-full"
            defaultValue={product.imageUrl}
          />
        </label>
        <label className="label mb-2 flex flex-col items-start  ">
          <span className="font-bold"> Price</span>
          <input
            required
            name="price"
            placeholder="Price"
            type="number"
            className="input-bordered input mt-2 w-full"
            defaultValue={product.price}
          />
        </label>
        <div className=" flex justify-center">
          <button
            type="submit"
            className="btn-primary btn shadow-md hover:shadow-xl"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
