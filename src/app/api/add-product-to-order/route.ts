import { prisma } from "@/lib/db/prisma";
import { Order, Prisma, Product } from "@prisma/client";
import { NextResponse } from "next/server";

export interface addProductToOrderResponse {
  message: string;
  orderId: string | null;
}
export interface addProductToOrderRequest {
  orderId: string | null;
  productId: string | null;
}
export async function POST(request: Request) {
  let response: addProductToOrderResponse;
  try {
    const { orderId, productId } = (await request.json()) as addProductToOrderRequest;
    if (!orderId) {
      response = { message: "No orderId", orderId: null };
      return NextResponse.json(response, { status: 400 });
    }
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      response = { message: "Order not found", orderId: null };
      return NextResponse.json(response, { status: 400 });
    }
    if (!productId) {
      response = { message: "ProductId not found", orderId: null };
      return NextResponse.json(response, { status: 400 });
    }
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      response = { message: "Product not found", orderId: null };
      return NextResponse.json(response, { status: 400 });
    }

    const { result } = await updateOrderItem({ orderId, product });
    if (!result) {
      response = { message: "Product not added to order", orderId: null };
      return NextResponse.json(response, { status: 500 });
    }
    response = {
      message: "Product added to order successfully",
      orderId: order.id,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const error = e as Error;
    response = { message: "New order not created. " + error.message, orderId: null };
    return NextResponse.json(response, { status: 500 });
  }
}

async function updateOrderItem({
  orderId,
  product,
}: {
  orderId: string;
  product: Product;
}): Promise<{ result: boolean }> {
  const orderItem = await prisma.orderItem.findFirst({
    where: { orderId, productId: product.id },
  });

  let newOrder;
  if (!orderItem) {
    newOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        items: {
          create: {
            productId: product.id,
            price: product.price,
            quantity: 1,
          },
        },
      },
      include: { items: true },
    });
  } else {
    newOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        items: {
          update: {
            where: { id: orderItem.id },
            data: {
              quantity: orderItem.quantity + 1,
            },
          },
        },
      },
      include: { items: true },
    });
    console.log("newOrder: ", newOrder);
  }
  return { result: true };
}
