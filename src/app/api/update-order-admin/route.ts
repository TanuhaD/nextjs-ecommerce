import { OrderItemWithProduct, OrderWithProducts } from "@/lib/db/order";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
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
          deleteMany: body.items
            .filter((item: OrderItemWithProduct) => item.quantity === 0)
            .map((item: OrderItemWithProduct) => ({ id: item.id })),
        },
      },
    });
    revalidatePath(`/api/orders/${order.id}`);
    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
