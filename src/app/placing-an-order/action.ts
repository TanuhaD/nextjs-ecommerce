"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function placeOrder(_: any, formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }

  const name = formData.get("name")?.toString();
  const address = formData.get("address")?.toString();
  const phone = formData.get("phone")?.toString();
  const email = formData.get("email")?.toString();
  const comments = formData.get("comments")?.toString();

  if (!name || !phone) {
    return {
      result: "FAIL",
      error: "Name and phone are required",
      prismaResult: null,
    };
  }

  try {
    // const prismaResult = await prisma.order.create({
    //   data: {
    //     name,
    //     address,
    //     phone,
    //     email,
    //     comments,
    //     status: "PENDING",
    //   },
    // });
    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: { items: { include: { product: true } } },
    });
    if (!cart) {
      redirect("/fobbiden");
    }
    const prismaResult = await prisma.$transaction(async (tx) => {
      await tx.order.create({
        data: {
          status: "PENDING",
          name,
          address,
          phone,
          email,
          comments,
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
      revalidatePath("/", "layout");
    });
    return {
      result: "CREATED",
      error: null,
      prismaResult,
    };
  } catch (e) {
    const error = e as Error;
    return {
      result: "FAIL",
      error: `Database error: ${error.message}`,
      prismaResult: null,
    };
  }
}
