import { GetCart } from "@/lib/db/cart";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./action";
import { formatPrice } from "@/lib/format";

export const metadata = {
  title: "Your cart - Flowmazon",
};

export default async function CartPage() {
  const cart = await GetCart();
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((item) => {
        return (
          <CartEntry
            cartItem={item}
            key={item.id}
            setProductQuantity={setProductQuantity}
          />
        );
      })}
      {!cart?.items.length && <p>Your cart is empty</p>}
      <div className="flex flex-col items-end sm:items-center">
        <p className="mb-3 font-bold">
          Total: {formatPrice(cart?.subTotal || 0)}
        </p>
        <button className="btn-primary btn  shadow-md hover:shadow-2xl sm:w-[200px]">
          Checkout
        </button>
      </div>
    </>
  );
}
