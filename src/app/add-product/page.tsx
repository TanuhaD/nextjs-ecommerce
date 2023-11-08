import FormSubmitButton from "@/components/FormSubmitButton";
import { prisma } from "@/lib/db/prisma";
import { checkAdminUser } from "@/lib/checkAdminUser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import UploadFromFileForm from "./UploadFromFileForm";
export const metadata = {
  title: "Add Product Flowmazon",
};

async function addProduct(formData: FormData) {
  "use server";
  checkAdminUser();
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);
  if (!name || !description || !imageUrl || !price) {
    throw new Error("Missing property");
  }
  await prisma.product.create({
    data: {
      name,
      description,
      imageUrl,
      price,
    },
  });
  revalidatePath("/");
  redirect("/");
}

export default async function AddProductPage() {
  checkAdminUser();
  return (
    <div>
      <h1 className="mb-3 text-lg font-bold">Add Product</h1>
      <form action={addProduct}>
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
          required
          name="imageUrl"
          placeholder="Image Url"
          type="url"
          className="input-bordered input mb-3 w-full shadow-md"
        />
        <input
          required
          name="price"
          placeholder="Price"
          type="number"
          className="input-bordered input mb-3 w-full shadow-md "
        />
        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
      <UploadFromFileForm />
    </div>
  );
}
