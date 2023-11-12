import { Storage } from "@google-cloud/storage";
import { nanoid } from "nanoid";

const storage = new Storage();

export const uploadFileToGoogleStorage: (
  buffer: Buffer,
  originalName: string
) => Promise<{ status: string; imgUrl: string; error: string | null }> = async (
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
