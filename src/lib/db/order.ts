import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type OrderWithProducts = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type OrderItemWithProduct = Prisma.OrderItemGetPayload<{
  include: { product: true };
}>;

export type OrderWithTotal = OrderWithProducts & {
  total: number;
};

export const GetOrders = async (userId: string) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: { items: { include: { product: true } } },
    });
    const processedOrders = orders.map((order) => {
      const total = order.items.reduce((acc, item) => {
        return acc + item.price * item.quantity;
      }, 0);
      return {
        ...order,
        total,
      };
    });
    return processedOrders;
  } catch (error) {
    console.error(error);
    return null;
  }
};
