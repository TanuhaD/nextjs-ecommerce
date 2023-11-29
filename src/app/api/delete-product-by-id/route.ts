import { prisma } from "@/lib/db/prisma";
import { deleteFileFromGCS } from "@/lib/google-cloud-storage/deleteFileFromGCS";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/authOptions";

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  } else if (session.user.role !== "ADMIN") {
    redirect("/forbidden");
  }
  const { productId } = await request.json();
  try {
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });
    if (deletedProduct.imageUrl) {
      deleteFileFromGCS(deletedProduct.imageUrl);
    }
    revalidatePath("/");
    revalidatePath("/dashboard");
    return NextResponse.json(
      { message: "'Product deleted successfully'" },
      { status: 200 },
    );
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
