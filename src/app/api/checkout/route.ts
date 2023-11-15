import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      redirect("/fobbiden");
    }
    await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          status: "PENDING",
          userId: session.user.id,
          items: {
            createMany: {
              data: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
        },
      });
      await tx.cart.delete({
        where: {
          id: cart.id,
        },
      });
    });
    revalidatePath("/", "layout");
    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating order or clearing cart" },
      { status: 500 }
    );
  }
}
