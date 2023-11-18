import { GetOrderBuId, OrderWithProducts } from "@/lib/db/order";
import OrderEditingForm from "./OrderEditingForm";

interface AdminOrderPageProps {
  params: {
    id: string;
  };
}
const AdminOrderPage: React.FC<AdminOrderPageProps> = async ({
  params: { id },
}) => {
  if (!id) {
    // Обробляйте ситуацію, коли id невизначено.
    return <div>Invalid ID</div>;
  }

  const order = await GetOrderBuId(id);

  if (!order) {
    // Обробляйте ситуацію, коли замовлення не знайдено.
    return <div>Order not found</div>;
  }

  return (
    <div>
      <OrderEditingForm orderResult={order} />
    </div>
  );
};
export default AdminOrderPage;
