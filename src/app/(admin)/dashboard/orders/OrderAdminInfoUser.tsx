import { OrderWithProductsAndUser } from "@/lib/db/order";

interface OrderAdminCustomerInfoProps {
  order: OrderWithProductsAndUser;
}

export default function OrderAdminInfoUser({
  order,
}: OrderAdminCustomerInfoProps) {
  return (
    <div className="bg-gray-150 mb-4 gap-6  rounded-md border p-4  shadow-md ">
      <h2 className=" text-bold medium mb-4 text-center sm:text-xl md:text-3xl">
        User Information
      </h2>
      <p className=" break-words border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl">
        Name: {order.user?.name}
      </p>
      <p className="break-words border-b-2 border-gray-200 p-4 font-medium text-info sm:text-sm md:text-2xl">
        Email: {order.user?.email}
      </p>
    </div>
  );
}
