import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { orderId, productId } = await request.json();
    console.log("orderId:", orderId);
    console.log("productId:", productId);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { message: "'Order not found'" },
        { status: 400 },
      );
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

    await prisma.order.update({
      where: { id: orderId },
      data: {
        items: {
          create: {
            productId: productId,
            price: product.price,
            quantity: 1,
          },
        },
      },
      include: { items: true },
    });

    return NextResponse.json(
      { message: "'Product added to order successfully" },
      { status: 200 },
    );
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
