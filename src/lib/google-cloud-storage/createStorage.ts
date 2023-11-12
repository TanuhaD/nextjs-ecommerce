import { Storage } from "@google-cloud/storage";
const storage = new Storage();
export const GCSbucketName = "demchenko-ecommerce";
export const GCSbucket = storage.bucket(GCSbucketName);
