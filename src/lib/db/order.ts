import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type OrderWithProducts = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

export type OrderItemWithProduct = Prisma.OrderItemGetPayload<{
  include: { product: true };
}>;

export type OrderWithProductsAndUser = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } }; user: true };
}>;

export interface GetOrdersByUserIdResult {
  orders: OrderWithProducts[] | null;
  error: string | null;
}
export const GetOrdersByUserId = async (
  userId: string,
): Promise<GetOrdersByUserIdResult> => {
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

export interface GetAllOrdersWithProductsAndUserResult {
  orders: OrderWithProductsAndUser[] | null;
  error: string | null;
}

export const GetAllOrders =
  async (): Promise<GetAllOrdersWithProductsAndUserResult> => {
    try {
      const orders = await prisma.order.findMany({
        include: { items: { include: { product: true } }, user: true },
      });
      return { orders, error: null };
    } catch (e) {
      const error = e as Error;
      console.error(error);
      return { orders: null, error: error.message };
    }
  };
export interface GetAllOrdersWithProductsResult {
  orders: OrderWithProducts[] | null;
  error: string | null;
}
export const findOrdersByQuery = async (
  query: string,
): Promise<GetAllOrdersWithProductsResult> => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { address: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { id: "desc" },
      include: { items: { include: { product: true } } },
    });
    return { orders, error: null };
  } catch (e) {
    const error = e as Error;
    console.error(error);
    return { orders: null, error: error.message };
  }
};
