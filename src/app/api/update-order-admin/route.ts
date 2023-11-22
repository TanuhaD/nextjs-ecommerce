import { OrderWithProducts } from "@/lib/db/order";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { id } = await request.json();
  try {
    const order = await prisma.order.update({
      where: { id: id },
      data: {
        name: "name",
        phone: "phone",
        adress: "adress",
        comments: "comments",
        status: "status",
        total: 123,
      },
      items: {
        update: {},
      },
    });

    return NextResponse.json(
      { message: "There should be an array of objects in the request body" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
