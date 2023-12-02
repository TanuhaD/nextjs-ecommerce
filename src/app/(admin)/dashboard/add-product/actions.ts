"use server";

import { prisma } from "@/lib/db/prisma";
import { fetchImageByLink } from "@/lib/fetchImageByLink";
import { EditUpdateServerActionResponse } from "@/types/edit-update-server-action-response";

import { uploadFileToGoogleStorage } from "@/lib/google-cloud-storage/saveFileToGCS";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function addProduct(
  _: any,
  formData: FormData,
): Promise<EditUpdateServerActionResponse> {
  let imageUrl = "";
  const imageFile = formData.get("imageFile") as unknown as File | null;
  const imageLink = formData.get("imageLink")?.toString();

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
        originalName,
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
  } catch (e) {
    const error = e as Error;
    return {
      result: "FAIL",
      error: error.message,
      prismaResult: null,
    };
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const price = Number(formData.get("price") || 0);
  const isFitchered = Boolean(formData.get("isFitchered") || false);
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
    const prismaResult = await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        price,
        isFitchered,
      },
    });
    revalidatePath("/");
    return {
      result: "CREATED",
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
