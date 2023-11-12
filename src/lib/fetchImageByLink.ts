export const fetchImageByLink = async (imageLink: string) => {
  try {
    const fetchResult = await fetch(imageLink);
    const contentType = fetchResult.headers.get("content-type");
    const fileType = contentType?.split("/")[0];
    const fileExtension = contentType?.split("/")[1];
    if (fileType !== "image") {
      return new Error("Provided link is not an image");
    }
    const bytes = await fetchResult.arrayBuffer();
    return { buffer: Buffer.from(bytes), fileExtension };
  } catch (e) {
    const error = e as Error;
    return new Error("Can't fetch an image: " + error.message);
  }
};
