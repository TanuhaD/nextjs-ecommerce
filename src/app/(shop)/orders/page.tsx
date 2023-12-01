import { env } from "@/lib/env";

import { GetOrdersByUserId } from "@/lib/db/order";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import OrderList from "./OrderList";
import { authOptions } from "@/app/api/auth/authOptions";
import PaginationBar from "@/components/PaginationBar/PaginationBar";
import { prisma } from "@/lib/db/prisma";

export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: "Your order - Flowmazon",
};

interface OrderProps {
  searchParams: { page: string };
}
export default async function OrderPage({
  searchParams: { page = "1" },
}: OrderProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  const { orders, error } = await GetOrdersByUserId(session.user.id);
  const currentPage = parseInt(page);

  const pageSize = 6;
  const heroItemCount = 1;

  const totalItemCount = orders?.length || 0;

  const totalPages = Math.ceil((totalItemCount - heroItemCount) / pageSize);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedOrders = orders?.slice(startIndex, endIndex);

  return (
    <>
      <h2 className="mb-6 rounded-md border p-2 pt-3 text-center  font-bold text-info shadow-md sm:text-xl md:text-3xl">
        Your orders {session.user.name}
      </h2>

      {paginatedOrders?.map((order) => {
        return <OrderList key={order.id} order={order} />;
      })}

      <div className="m-auto flex justify-center">
        {totalPages > 1 && (
          <PaginationBar currentPage={currentPage} totalPages={totalPages} />
        )}
      </div>
    </>
  );
}
