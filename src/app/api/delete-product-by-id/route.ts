import { prisma } from "@/lib/db/prisma";
import { deleteFileFromGCS } from "@/lib/google-cloud-storage/deleteFileFromGCS";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/authOptions";

export interface deleteProductByIdResponse {
  message: string;
  productId: string | null;
}
export interface deleteProductByIdRequest {
  productId: string | null;
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  } else if (session.user.role !== "ADMIN") {
    redirect("/forbidden");
  }
  let response: deleteProductByIdResponse;
  const { productId } = (await request.json()) as deleteProductByIdRequest;
  if (!productId) {
    response = { message: "No productId", productId: null };
    return NextResponse.json(response, { status: 400 });
  }
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });
    if (deletedProduct.imageUrl) {
      deleteFileFromGCS(deletedProduct.imageUrl);
    }
    revalidatePath("/");
    revalidatePath("/dashboard");
    response = { message: "'Product deleted successfully'", productId: productId };
    return NextResponse.json(response, { status: 200 });
  } catch (e) {
    const error = e as Error;
    response = { message: "Product not deleted" + error.message, productId: null };
    return NextResponse.json(response, { status: 400 });
  }
}
