"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { CartWithProducts } from "@/lib/db/cart";
import { cookies } from "next/dist/client/components/headers";
import { sendTelegramMessage } from "@/lib/sendTelegramMessage";
import { env } from "@/lib/env";

export async function placeOrder(_: any, formData: FormData) {
  const session = await getServerSession(authOptions);

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
    let cart: CartWithProducts | null = null;
    if (session) {
      cart = await prisma.cart.findFirst({
        where: {
          userId: session.user.id,
        },
        include: { items: { include: { product: true } } },
      });
    } else {
      const localCartId = cookies().get("localCartId")?.value;
      cart = await prisma.cart.findFirst({
        where: { id: localCartId },
        include: { items: { include: { product: true } } },
      });
    }

    if (!cart) {
      redirect("/fobbiden");
    }
    const prismaResult = await prisma.$transaction(async (tx) => {
      const asyncCart = cart as CartWithProducts;
      const total = asyncCart.items.reduce(
        (acc, item) => item.product.price * item.quantity + acc,
        0
      );
      const newOrder = await tx.order.create({
        data: {
          status: "PENDING",
          name,
          address,
          phone,
          email,
          comments,
          total,
          userId: session?.user.id,
          items: {
            createMany: {
              data: asyncCart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
              })),
            },
          },
        },
      });
      const orderQuantity = await tx.order.count();
      console.log("newOrder", newOrder);
      const link = `${env.BASE_URL}orders/admin/${newOrder.id}/`;
      // const link = "https://google.com";
      const telegramMarkupMessage = `<a href="${link}">Order link</a>\n
      <b>order Number:</b> ${orderQuantity}\n
      name: ${newOrder.name}\n
      phone: ${newOrder.phone}
      `;

      await sendTelegramMessage(telegramMarkupMessage, "HTML");
      await tx.cart.delete({
        where: {
          id: asyncCart.id,
        },
      });
      revalidatePath(`/cart`);
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
