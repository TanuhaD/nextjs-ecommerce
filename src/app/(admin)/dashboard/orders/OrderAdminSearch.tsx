import { redirect } from "next/navigation";

async function searchOrders(formData: FormData) {
  "use server";

  const searchQuery = formData.get("searchQuery")?.toString();
  if (searchQuery) {
    redirect("/dashboard/orders/search?query=" + searchQuery);
  }
}

export default function OrderAdminSearch() {
  return (
    <>
      <form action={searchOrders} className="mb-6">
        <div className="form-control">
          <input
            className=" input input-bordered m-auto min-w-[100px] max-w-[300px]"
            name="searchQuery"
            placeholder="Search"
          />
        </div>
      </form>
    </>
  );
}
