import { Storage } from "@google-cloud/storage";
const key = JSON.parse(process.env.GCS_KEY!);
const storage = new Storage({ projectId: key.project_id, credentials: key });
export const GCSbucketName = "demchenko-ecommerce";
export const GCSbucket = storage.bucket(GCSbucketName);
