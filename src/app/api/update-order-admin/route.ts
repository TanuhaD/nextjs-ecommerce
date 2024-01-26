import { OrderItemWithProduct, OrderWithProducts } from "@/lib/db/order";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export interface orderEditingFormRequest {
  id: string;
  name: string;
  phone: string;
  address: string;
  comments: string;
  status: string;
  total: number;
  items: OrderItemWithProduct[];
}
export interface orderEditingFormResponse {
  message: string;
  orderId: string | null;
}
export async function POST(request: Request) {
  let response: orderEditingFormResponse;
  try {
    const body = (await request.json()) as orderEditingFormRequest;

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
    response = { message: "Order updated", orderId: order.id };
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const error = e as Error;
    response = { message: "Order not updated" + error.message, orderId: null };
    return NextResponse.json(response, { status: 400 });
  }
}
