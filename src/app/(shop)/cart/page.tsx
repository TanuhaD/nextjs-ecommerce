import { GetCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./action";
import { formatPrice } from "@/lib/format";
import { env } from "@/lib/env";

import Link from "next/link";

export const metadata = {
  metadataBase: new URL(env.BASE_URL),
  title: "Your cart - PrimePicks",
};

export default async function CartPage() {
  const cart = await GetCart();
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((item) => {
        return <CartEntry cartItem={item} key={item.id} setProductQuantity={setProductQuantity} />;
      })}
      {!cart?.items.length && <p>Your cart is empty</p>}
      <div className="flex flex-col gap-3 sm:items-center md:items-end">
        <p className="mb-3 font-bold">Total: {formatPrice(cart?.subTotal || 0)}</p>
      </div>

      {cart?.items.length !== 0 && (
        <div className="flex flex-col gap-3 sm:items-center md:items-end">
          <Link href="/" className="btn btn-primary  shadow-md hover:shadow-2xl sm:w-[200px]">
            Continue shopping
          </Link>
          <Link href="/placing-an-order" className="btn btn-primary  shadow-md hover:shadow-2xl sm:w-[200px]">
            Placing an order
          </Link>
        </div>
      )}
    </>
  );
}
