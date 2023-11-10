"use server";

import { checkAdminUser } from "@/lib/checkAdminUser";
import { prisma } from "@/lib/db/prisma";
import { Storage } from "@google-cloud/storage";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
const storage = new Storage();

const uploadFileToGoogleStorage = async (
  buffer: Buffer,
  originalName: string
) => {
  const bucketName = "demchenko-ecommerce";
  const bucket = storage.bucket(bucketName);
  const fileName = `${nanoid()}_${originalName}`;
  const blob = bucket.file(fileName);

  try {
    const blobStream = blob.createWriteStream();

    await new Promise((resolve, reject) => {
      blobStream.on("error", (err) => {
        reject(err);
      });

      blobStream.on("finish", () => {
        resolve("OK");
      });

      blobStream.end(buffer);
    });
    return {
      status: "SUCCESS",
      imgUrl: `https://storage.googleapis.com/${bucketName}/${fileName}`,
      error: null,
    };
  } catch (e) {
    const error = e as Error;
    return {
      status: "FAIL",
      error: error.message,
      imgUrl: "",
    };
  }
};

export async function addProduct(prevState: any, formData: FormData) {
  checkAdminUser();

  let imageUrl = "";
  const imageFile = formData.get("imageFile") as unknown as File;
  const imageLink = formData.get("imageLink")?.toString();

  let buffer: Buffer | null = null;
  let originalName: string | null = null;

  try {
    if (imageFile.size) {
      console.log("imageFile", imageFile);
      const bytes = await imageFile.arrayBuffer();
      buffer = Buffer.from(bytes);
      originalName = imageFile.name;
    } else if (imageLink) {
      const fetchResult = await fetch(imageLink);
      const contentType = fetchResult.headers.get("content-type");
      const fileType = contentType?.split("/")[0];
      const fileExtension = contentType?.split("/")[1];
      if (fileType !== "image") {
        throw new Error("Provided link is not an image");
      }
      const bytes = await fetchResult.arrayBuffer();
      buffer = Buffer.from(bytes);
      originalName = nanoid() + "." + fileExtension;
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
        };
      }
      imageUrl = uploadResult.imgUrl;
    }
  } catch (e) {
    const error = e as Error;
    return {
      result: "FAIL",
      error: error.message,
    };
  }

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const price = Number(formData.get("price") || 0);
  if (!name || !description || !price) {
    return {
      result: "FAIL",
      error: `Missing property: name=${name}, description=${description}, price=${price}`,
    };
  }
  try {
    const prismaResult = await prisma.product.create({
      data: {
        name,
        description,
        imageUrl,
        price,
      },
    });
    revalidatePath("/");
    return {
      result: "SUCCESS",
      error: null,
      prismaResult,
    };
  } catch (e) {
    const error = e as Error;
    return {
      result: "FAIL",
      error: `Database error: ${error.message}`,
    };
  }
}
