import { AddUpdateProductForm } from "@/components/AdminComponents/AddUpdateProductForm";
import { env } from "@/lib/env";
import UploadFromFileForm from "./UploadFromFileForm";
import { addProduct } from "./actions";
export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: "Add Product Flowmazon",
};

export default async function AddProductPage() {
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
