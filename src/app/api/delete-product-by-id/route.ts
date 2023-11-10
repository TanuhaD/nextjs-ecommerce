import { checkAdminUser } from "@/lib/checkAdminUser";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  checkAdminUser();
  const { productId } = await request.json();
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
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
