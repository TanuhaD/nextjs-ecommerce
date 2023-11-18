import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type OrderWithProducts = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type OrderItemWithProduct = Prisma.OrderItemGetPayload<{
  include: { product: true };
}>;

export interface GetOrdersResult {
  orders: OrderWithProducts[] | null;
  error: string | null;
}
// orders: (OrderWithProducts & { items: any[] })[] | null;
export const GetOrders = async (userId: string): Promise<GetOrdersResult> => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: { items: { include: { product: true } } },
    });
    return { orders, error: null };
  } catch (e) {
    const error = e as Error;
    console.error(error);
    return { orders: null, error: error.message };
  }
};

export interface GetOrderByIdResult {
  order: OrderWithProducts | null;
  error: string | null;
}

export const GetOrderBuId = async (id: string): Promise<GetOrderByIdResult> => {
  try {
    if (!id) {
      return { order: null, error: "Invalid id" };
    }
    console.log("id", id);
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: { items: { include: { product: true } } },
    });

    return {
      order: order || null,
      error: null,
    };
  } catch (e) {
    const error = e as Error;
    return { order: null, error: `Database error: ${error.message}` };
  }
};
