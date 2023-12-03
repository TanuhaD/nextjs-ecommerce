import { GetAllOrders } from "@/lib/db/order";

import Link from "next/link";

import OrderAdminInfoProduct from "./OrderAdminInfoProduct";
import OrderAdminSearch from "./OrderAdminSearch";
import OrderAdminInfoUser from "./OrderAdminInfoUser";
import OrderAdminInfoCustomer from "./OrderAdminInfoCustomer";
import PaginationBar from "@/components/PaginationBar/PaginationBar";
import { prisma } from "@/lib/db/prisma";

interface AllOrdersAdminPageProps {
  searchParams: { page: string };
}
const AllOrdersAdminPage = async ({
  searchParams: { page = "1" },
}: AllOrdersAdminPageProps) => {
  const { orders, error } = await GetAllOrders();

  const currentPage = parseInt(page);

  const pageSize = 6;

  const totalItemCount = await prisma.order.count();

  const totalPages = Math.ceil(totalItemCount / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const paginatedOrders = orders?.slice(startIndex, endIndex);

  return (
    <>
      {error && <div>Something went wrong... Try again later.</div>}
      {orders && (
        <>
          <ul className="mb-6 flex flex-col rounded-md border p-4 shadow-md">
            <h1 className="mb-6 rounded-md border p-2 pt-3 text-center  font-bold text-info shadow-md sm:text-xl md:text-3xl">
              {" "}
              All Oreders
            </h1>
            <OrderAdminSearch />
            {orders.map((order) => (
              <li
                key={order.id}
                className=" mb-6 rounded-md border-2 border-solid border-primary bg-slate-50  p-4 shadow-md"
              >
                <OrderAdminInfoUser order={order} />
                <OrderAdminInfoCustomer order={order} />
                <div className="flex flex-col gap-4  ">
                  <ul>
                    {order.items.map((item) => {
                      return (
                        <OrderAdminInfoProduct item={item} key={item.id} />
                      );
                    })}
                  </ul>
                  <div className="flex flex-col justify-between gap-2 rounded-md border p-4  font-semibold shadow-md  md:flex-row md:items-center">
                    <div>
                      <p className="font-medium sm:text-sm md:text-2xl">
                        Totall: {order.total / 100} $
                      </p>
                      <p className="font-medium sm:text-sm md:text-2xl">
                        Status: {order.status}
                      </p>
                      <p className="font-medium sm:text-sm md:text-2xl">
                        PaymentStatus: {order.paymentStatus}
                      </p>
                      <p className="font-bold sm:text-sm md:text-2xl">
                        Created: {order.createdAt.getDate()}.
                        {order.createdAt.getMonth()}.
                        {order.createdAt.getFullYear()}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="btn btn-primary font-bold shadow-md hover:shadow-xl"
                    >
                      Choose
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="m-4 flex justify-center">
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AllOrdersAdminPage;
