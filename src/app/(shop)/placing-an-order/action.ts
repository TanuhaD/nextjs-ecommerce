"use server";

import { authOptions } from "@/app/api/auth/authOptions";
import { CartWithProducts } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { sendTelegramMessage } from "@/lib/sendTelegramMessage";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/dist/client/components/headers";
import { redirect } from "next/navigation";
import { ZodError, z } from "zod";

const schema = z.object({
  name: z.string().min(3),
  phone: z.string().min(3),
  email: z.string().email(),
  address: z.string().min(3),
  comments: z.string().max(1000),
});
interface validationFields {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  comments?: string;
}
interface FormValues {
  name: string;
  phone: string;
  email: string;
  address: string;
  comments: string;
}

export interface PlaceOrderResult {
  result: "CREATED" | "FAIL" | null;
  error: string | null;
  validationErrors?: validationFields | null;
}

export async function placeOrder(
  _: any,
  formData: FormData,
): Promise<PlaceOrderResult> {
  const session = await getServerSession(authOptions);

  const formValues = Object.fromEntries(
    formData.entries(),
  ) as unknown as FormValues;

  try {
    schema.parse(formValues);
  } catch (e) {
    const error = e as ZodError;
    const validationErrors: validationFields = {};
    error.errors.forEach((err) => {
      const field = err.path.join(".") as keyof validationFields;
      validationErrors[field] = err.message;
    });
    return {
      result: "FAIL",
      validationErrors,
      error: null,
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
        0,
      );
      const newOrder = await tx.order.create({
        data: {
          status: "PENDING",
          name: formValues.name,
          address: formValues.address,
          phone: formValues.phone,
          email: formValues.email,
          comments: formValues.comments,
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
    };
  } catch (e) {
    const error = e as Error;
    return {
      result: "FAIL",
      error: `Database error: ${error.message}`,
    };
  }
}
