"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma";
import { fetchImageByLink } from "@/lib/fetchImageByLink";
import { deleteFileFromGCS } from "@/lib/google-cloud-storage/deleteFileFromGCS";
import { uploadFileToGoogleStorage } from "@/lib/saveFileToGCS";
import { EditUpdateServerActionResponse } from "@/types/edit-update-server-action-response";

import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProduct(
  _: any,
  formData: FormData
): Promise<EditUpdateServerActionResponse> {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  } else if (session.user.role !== "ADMIN") {
    redirect("/forbidden");
  }

  let imageUrl = "";
  const imageLink = formData.get("imageLink")?.toString();

  if (!imageLink?.match(/https:\/\/storage\.googleapis\.com/)) {
    const imageFile = formData.get("imageFile") as unknown as File;
    let buffer: Buffer | null = null;
    let originalName: string | null = null;

    try {
      if (imageFile?.size) {
        const bytes = await imageFile.arrayBuffer();
        buffer = Buffer.from(bytes);
        originalName = imageFile.name;
      } else if (imageLink) {
        const fetchResult = await fetchImageByLink(imageLink);
        if (fetchResult instanceof Error) {
          throw fetchResult;
        }
        buffer = fetchResult.buffer;
        originalName = nanoid() + "." + fetchResult.fileExtension;
      }

      if (buffer && originalName) {
        const uploadResult = await uploadFileToGoogleStorage(
          buffer,
          originalName
        );
        if (uploadResult.status === "FAIL") {
          return {
            result: "FAIL",
            error: uploadResult.error,
            prismaResult: null,
          };
        }
        imageUrl = uploadResult.imgUrl;
      }
      // delete image
      const deleteImageUrl = formData.get("oldImageLink")?.toString();
      if (
        deleteImageUrl &&
        deleteImageUrl.match(/https:\/\/storage\.googleapis\.com/)
      ) {
        const deleteResult = await deleteFileFromGCS(deleteImageUrl);
        if (deleteResult.result === "FAIL") {
          console.log(deleteResult.error);
        }
      }
    } catch (e) {
      const error = e as Error;
      return {
        result: "FAIL",
        error: error.message,
        prismaResult: null,
      };
    }
  } else {
    imageUrl = imageLink;
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const price = Number(formData.get("price") || 0);
  const productId = formData.get("productId")?.toString();
  if (!name || !description || !price) {
    return {
      result: "FAIL",
      error: `Missing property: ${!name ? "name, " : ""} ${
        !description ? "description, " : ""
      } ${!price ? "price" : ""}`,
      prismaResult: null,
    };
  }
  try {
    const prismaResult = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        imageUrl,
        price,
      },
    });
    revalidatePath("/");
    return {
      result: "UPDATED",
      error: null,
      prismaResult,
    };
  } catch (e) {
    const error = e as Error;
    return {
      result: "FAIL",
      error: `Database error: ${error.message}`,
      prismaResult: null,
    };
  }
}
