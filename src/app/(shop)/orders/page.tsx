import { env } from "@/lib/env";

import { GetOrdersByUserId } from "@/lib/db/order";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import OrderList from "./OrderList";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: "Your order - Flowmazon",
};

export default async function OrderPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  const { orders, error } = await GetOrdersByUserId(session.user.id);

  return (
    <>
      <h2 className="mb-6 rounded-md border p-2 pt-3 text-center  font-bold text-info shadow-md sm:text-xl md:text-3xl">
        Your orders {session.user.name}
      </h2>

      {orders?.map((order) => {
        return <OrderList key={order.id} order={order} />;
      })}
    </>
  );
}
