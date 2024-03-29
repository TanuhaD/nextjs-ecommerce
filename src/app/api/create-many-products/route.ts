import { prisma } from "@/lib/db/prisma";
import { fetchImageByLink } from "@/lib/fetchImageByLink";
import { uploadFileToGoogleStorage } from "@/lib/google-cloud-storage/saveFileToGCS";
import { Product } from "@prisma/client";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  imageUrl: z.string(),
});
export async function POST(request: Request) {
  let res: Product[] = [];
  try {
    res = await request.json();
    if (!Array.isArray(res))
      return NextResponse.json(
        { message: "There should be an array of objects in the request body" },
        { status: 400 },
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

  const productArrayForDB = [];

  for (const { name, description, imageUrl, price } of res) {
    if (imageUrl) {
      try {
        const fetchResult = await fetchImageByLink(imageUrl);
        if (fetchResult instanceof Error) {
          productArrayForDB.push({
            name,
            description,
            price,
            imageUrl: "",
          });
          console.error(fetchResult);
          continue;
        }
        const buffer = fetchResult.buffer;
        const originalName = nanoid() + "." + fetchResult.fileExtension;
        const uploadResult = await uploadFileToGoogleStorage(buffer, originalName);
        if (uploadResult.status === "FAIL") {
          console.error(uploadResult.error);
        }
        productArrayForDB.push({
          name,
          description,
          price,
          imageUrl: uploadResult.imgUrl,
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      productArrayForDB.push({
        name,
        description,
        price,
        imageUrl,
      });
    }
  }

  const prismaResult = await prisma.product.createMany({
    data: productArrayForDB,
  });
  revalidatePath("/");
  return new Response(JSON.stringify({ message: "success", count: prismaResult.count }));
}
