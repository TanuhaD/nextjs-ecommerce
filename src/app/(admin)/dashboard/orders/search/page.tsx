import { findOrdersByQuery } from "@/lib/db/order";
import OrderAdminSearch from "../OrderAdminSearch";
import OrderAdminInfoUser from "../OrderAdminInfoCustomer";
import OrderAdminInfoProduct from "../OrderAdminInfoProduct";
import Link from "next/link";
interface SearchProps {
  searchParams: {
    query: string;
  };
}
const AllOrdersAdminPage = async ({ searchParams: { query } }: SearchProps) => {
  const { orders, error } = await findOrdersByQuery(query);
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
                <div className="flex flex-col gap-4  ">
                  <ul>
                    {order.items.map((item) => {
                      return (
                        <OrderAdminInfoProduct item={item} key={item.id} />
                      );
                    })}
                  </ul>
                  <div className=" flex items-center justify-between gap-2 rounded-md border  p-4 font-semibold  shadow-md">
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
                      href={`/orders/admin/${order.id}`}
                      className="btn btn-primary font-bold shadow-md hover:shadow-xl"
                    >
                      Choose
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default AllOrdersAdminPage;
