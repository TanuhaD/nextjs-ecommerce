import { PlacingAnOrderForm } from "./PlacingAnOrderForm";
import { placeOrder } from "./action";

export default async function PlacingAnOrderPage() {
  return (
    <div>
      <h1 className="mb-6 text-center text-3xl font-bold">Placing an order</h1>
      <PlacingAnOrderForm action={placeOrder} />
    </div>
  );
}
