import { AddUpdateProductForm } from "@/components/AddUpdateProductForm";
import { env } from "@/lib/env";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import UploadFromFileForm from "./UploadFromFileForm";
import { addProduct } from "./actions";
export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: "Add Product Flowmazon",
};

export default async function AddProductPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  } else if (session.user.role !== "ADMIN") {
    redirect("/forbidden");
  }
  return (
    <div>
      <h1 className="mb-4 text-lg font-bold">Add Product</h1>
      <h2 className="mb-3 text-center text-lg font-bold">
        Add product manually
      </h2>
      <AddUpdateProductForm action={addProduct} />
      <div className="divider"></div>
      <h2 className="mb-3 text-center text-lg font-bold">
        Add product from file
      </h2>
      <UploadFromFileForm />
    </div>
  );
}
