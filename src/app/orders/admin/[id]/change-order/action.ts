import { prisma } from "@/lib/db/prisma";
import {
  EditUpdateServerActionResponse,
  EditUpdateServerActionResponseOrder,
} from "@/types/edit-update-server-action-response";
import { revalidatePath } from "next/cache";

export async function updateOrder(
  _: any,
  formData: FormData
): Promise<EditUpdateServerActionResponseOrder> {
  const name = formData.get("name")?.toString();
  const phone = formData.get("phone")?.toString();
  const adress = formData.get("adress")?.toString();
  const comments = formData.get("comments")?.toString() || "";
  const status = formData.get("status")?.toString();
  const totall = formData.get("totall")?.toString();
  const productId = formData.get("productId")?.toString();
  const quantity = formData.get("quantity")?.toString();
  const id = formData.get("id")?.toString();
  const nameProduct = formData.get("nameProduct")?.toString();
  // const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price") || 0);

  if (
    !name ||
    !phone ||
    !status ||
    !totall ||
    !productId ||
    !quantity ||
    !id ||
    !price
  ) {
    return {
      result: "FAIL",
      error: "Please fill all fields",
      prismaResultOrder: null,
    };
  }
  try {
    const prismaResultOrder = await prisma.order.update({
      where: { id: id },
      data: {
        name,
        phone,
        adress,
        comments,
        status,
        totall,
      },
      items: {
        update: {
          where: { id: productId },
          data: {
            quantity: quantity,
            product: {
              update: {
                where: { id: productId },
                data: {
                  name: nameProduct,
                  quantity,
                  price,
                },
              },
            },
          },
        },
      },
    });

    revalidatePath("/admin/orders");
    return {
      result: "UPDATED",
      error: null,
      prismaResultOrder,
    };
  } catch (e) {
    const error = e as Error;
    return {
      result: "FAIL",
      error: `Database error: ${error.message}`,
      prismaResultOrder: null,
    };
  }
}
