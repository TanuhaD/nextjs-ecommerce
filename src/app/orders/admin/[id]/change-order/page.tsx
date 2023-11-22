import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

import { updateOrder } from "./action";
import { Prisma } from "@prisma/client";
import { UpdateOrder } from "./UpdateOrder";

interface ChangeOrderPageProps {
  params: {
    id: string;
  };
}

export type OrderWithProductsType = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export default async function ChangeOrderPage({
  params: { id },
}: ChangeOrderPageProps) {
  if (!id) {
    return { order: null, error: "Invalid id" };
  }
  const orders = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!orders) redirect("/orders/admin");
  return (
    <div>
      <h1 className="mb-3 text-center text-lg font-bold">Change order</h1>
    </div>
  );
}
