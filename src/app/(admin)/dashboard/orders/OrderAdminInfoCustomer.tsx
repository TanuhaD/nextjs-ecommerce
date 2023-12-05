import { OrderWithProducts } from "@/lib/db/order";

interface OrderAdmnInfoUserProps {
  order: OrderWithProducts;
}
export default function OrderAdminInfoCustomer({
  order,
}: OrderAdmnInfoUserProps) {
  return (
    <div className="bg-gray-150 mb-4 gap-6  rounded-md border p-4  shadow-md ">
      <h2 className=" text-bold medium mb-4 text-center sm:text-xl md:text-3xl">
        Customer Information
      </h2>
      <p className=" break-words border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl">
        {" "}
        Name:{order.name}
      </p>
      <p className="break-words border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl">
        {" "}
        Phone: {order.phone}
      </p>
      <p className="break-words border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl">
        {" "}
        Adress: {order.address}
      </p>
      <p className=" break-words border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl">
        {" "}
        Comments: {order.comments}
      </p>
    </div>
  );
}
