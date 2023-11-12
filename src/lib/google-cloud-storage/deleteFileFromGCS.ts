import { GCSbucket } from "./createStorage";

export const deleteFileFromGCS = async (fileUrl: string) => {
  try {
    const fileName = fileUrl.replace(
      "https://storage.googleapis.com/demchenko-ecommerce/",
      ""
    );
    const blob = GCSbucket.file(fileName);
    await blob.delete();
    return {
      result: "SUCCESS",
      error: null,
    };
  } catch (e) {
    const error = e as Error;
    return {
      result: "FAIL",
      error: error.message,
    };
  }
};
