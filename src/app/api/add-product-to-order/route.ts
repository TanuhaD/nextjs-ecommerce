import { prisma } from "@/lib/db/prisma";
import { Order, Product } from "@prisma/client";
import { NextResponse } from "next/server";

export interface addProductToOrderResponse {
  message: string;
  order: Order | null;
}

export async function POST(request: Request) {
  let response: addProductToOrderResponse;
  try {
    const { orderId, productId } = await request.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      response = { message: "'Order not found'", order: null };
      return NextResponse.json(response, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { message: "'Product not found'" },
        { status: 400 },
      );
    }

    const newOrder = await updateOrderItem({ orderId, product });
    response = {
      message: "Product added to order successfully",
      order: newOrder,
    };
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

async function updateOrderItem({
  orderId,
  product,
}: {
  orderId: string;
  product: Product;
}) {
  console.log("orderId:", orderId);
  console.log("productId:", product.id);
  const orderItem = await prisma.orderItem.findFirst({
    where: { orderId, productId: product.id },
  });
  console.log("orderItem:", orderItem);
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
    console.log("newOrder:", newOrder);
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
    console.log("newOrder:", newOrder);
  }
  return newOrder;
}
