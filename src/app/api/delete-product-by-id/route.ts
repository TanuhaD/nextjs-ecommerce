import { checkAdminUser } from "@/lib/checkAdminUser";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  checkAdminUser();
  const { productId, userId } = await request.json();
  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    return NextResponse.json(
      { message: "'Product deleted successfully'" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }

  // revalidatePath("/product");
  // redirect("/");
}
