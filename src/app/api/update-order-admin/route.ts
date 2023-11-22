import { OrderItemWithProduct, OrderWithProducts } from "@/lib/db/order";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order = await prisma.order.update({
      where: { id: body.id },
      data: {
        name: body.name,
        phone: body.phone,
        address: body.address,
        comments: body.comments,
        status: body.status,
        total: body.total,
        items: {
          updateMany: body.items.map((item: OrderItemWithProduct) => {
            return {
              where: { id: item.id },
              data: {
                quantity: item.quantity,
                price: item.price,
              },
            };
          }),
        },
      },
    });

    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
