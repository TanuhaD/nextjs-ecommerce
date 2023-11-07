"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CreateCart, GetCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { use } from "react";

export async function incrementProductQuantity(productId: string) {
  const cart = (await GetCart()) ?? (await CreateCart());

  const articleInCart = cart.items.find((item) => item.productId === productId);

  if (articleInCart) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          update: {
            where: { id: articleInCart.id },
            data: { quantity: { increment: 1 } },
          },
        },
      },
    });
  } else {
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: {
          create: {
            productId,
            quantity: 1,
          },
        },
      },
    });
  }

  revalidatePath("/product/[id]");
}

export async function deleteProductId(productId: string, userId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  } else if (session.user.role !== "ADMIN") {
    redirect("/forbidden");
  }
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return alert("Product not found");
    }

    const userCart = await prisma.cart.findFirst({
      where: {
        userId,
      },
    });

    if (!userCart) {
      return alert("User's cart not found");
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    await prisma.cartItem.deleteMany({
      where: {
        productId,
        cart: {
          userId,
        },
      },
    });

    await prisma.cart.deleteMany({
      where: {
        id: userCart.id,
        items: {
          none: {
            productId,
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
  }

  revalidatePath("/product/[id]");
}
