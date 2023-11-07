import { prisma } from "@/lib/db/prisma";
import { Product } from "@prisma/client";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
const schema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  price: z.number().nonnegative(),
  imageUrl: z
    .string()
    .nonempty()
    .regex(/^https:\/\/images\.unsplash\.com\/.*/),
});
export async function POST(request: Request) {
  let res: Product[] = [];
  try {
    res = await request.json();
    if (!Array.isArray(res))
      return NextResponse.json(
        { message: "There should be an array of objects in the request body" },
        { status: 400 }
      );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  try {
    res.forEach((item: any) => {
      schema.parse(item);
    });
  } catch (error) {
    const e = error as ZodError;
    return NextResponse.json({ message: e.message }, { status: 400 });
  }

  const prismaResult = await prisma.product.createMany({
    data: res,
  });

  return new Response(
    JSON.stringify({ message: "success", count: prismaResult.count })
  );
}
