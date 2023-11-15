import { env } from "@/lib/env";

import { GetOrders } from "@/lib/db/order";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { formatPrice } from "@/lib/format";
import OrderList from "./OrderList";

export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: "Your order - Flowmazon",
};

export default async function OrderPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  const orders = await GetOrders(session.user.id);
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
