"use server";

import { checkAdminUser } from "@/lib/checkAdminUser";
import { CreateCart, GetCart } from "@/lib/db/cart";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  revalidatePath("/product");
}

// export async function deleteProductId(productId: string, userId: string) {
//   checkAdminUser();

//   try {
//     await prisma.product.delete({
//       where: { id: productId },
//     });
//     return true;
//   } catch (e) {
//     console.log(e);
//   }

//   revalidatePath("/");
//   redirect("/");
// }
