import { nanoid } from "nanoid";
import { GCSbucket, GCSbucketName } from "./createStorage";

export const uploadFileToGoogleStorage: (
  buffer: Buffer,
  originalName: string
) => Promise<{ status: string; imgUrl: string; error: string | null }> = async (
  buffer: Buffer,
  originalName: string
) => {
  const fileName = `${nanoid()}_${originalName}`;
  const blob = GCSbucket.file(fileName);

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
      imgUrl: `https://storage.googleapis.com/${GCSbucketName}/${fileName}`,
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
