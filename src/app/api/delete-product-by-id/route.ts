import { checkAdminUser } from "@/lib/checkAdminUser";
import { prisma } from "@/lib/db/prisma";
import { deleteFileFromGCS } from "@/lib/google-cloud-storage/deleteFileFromGCS";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  checkAdminUser();
  const { productId } = await request.json();
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });
    if (deletedProduct.imageUrl) {
      deleteFileFromGCS(deletedProduct.imageUrl);
    }
    revalidatePath("/");
    return NextResponse.json(
      { message: "'Product deleted successfully'" },
      { status: 200 }
    );
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
