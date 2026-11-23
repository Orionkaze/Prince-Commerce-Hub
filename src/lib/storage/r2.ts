import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID =
  process.env.R2_ACCOUNT_ID ||
  process.env.CLOUDFLARE_ACCOUNT_ID ||
  "f16424f57b37ebfb87e114ab52d6b849";
const R2_ACCESS_KEY_ID =
  process.env.R2_ACCESS_KEY_ID ||
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
  "11a0acdc840f66f2b977b79ab802708f";
const R2_SECRET_ACCESS_KEY =
  process.env.R2_SECRET_ACCESS_KEY ||
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
  "91534308fa5d1280c555ff25e5e234fb82f8e631d4ed1d03dff83420074afe56";
const R2_BUCKET_NAME =
  process.env.R2_BUCKET_NAME ||
  process.env.CLOUDFLARE_R2_BUCKET_NAME ||
  "prime-commerce-storage";
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || "";

export const isR2Configured = Boolean(
  R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME
);

// S3-compatible client for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Generate a structured R2 object key
 */
export function buildR2ObjectKey(params: {
  contentType: "video" | "pdf" | "thumbnail" | "assignment" | "other";
  courseId?: string;
  moduleId?: string;
  lectureId?: string;
  filename: string;
}): string {
  const sanitizedFilename = params.filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
  const timestamp = Date.now();
  const cId = params.courseId ? params.courseId.toLowerCase().replace(/[^a-z0-9-]/g, "-") : "general";

  if (params.contentType === "thumbnail") {
    return `courses/${cId}/thumbnail/${timestamp}-${sanitizedFilename}`;
  }

  if (params.contentType === "video" && params.lectureId) {
    const mId = params.moduleId || "general";
    return `courses/${cId}/modules/${mId}/lectures/${params.lectureId}/video-${timestamp}-${sanitizedFilename}`;
  }

  if (params.lectureId) {
    const mId = params.moduleId || "general";
    return `courses/${cId}/modules/${mId}/lectures/${params.lectureId}/resources/${timestamp}-${sanitizedFilename}`;
  }

  switch (params.contentType) {
    case "video":
      return `recordings/${cId}/${timestamp}-${sanitizedFilename}`;
    case "pdf":
    case "other":
      return `notes/${cId}/${timestamp}-${sanitizedFilename}`;
    case "assignment":
      return `assignments/${cId}/${timestamp}-${sanitizedFilename}`;
    default:
      return `resources/${timestamp}-${sanitizedFilename}`;
  }
}

/**
 * Generate presigned PUT URL for direct browser-to-R2 upload (Standard Single-part)
 */
export async function createPresignedUploadUrl(params: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<{ uploadUrl: string; key: string }> {
  if (!isR2Configured) {
    return {
      uploadUrl: `/api/upload/mock-upload?key=${encodeURIComponent(params.key)}`,
      key: params.key,
    };
  }

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, {
    expiresIn: params.expiresInSeconds || 3600, // 1 hour
  });

  return { uploadUrl, key: params.key };
}

/**
 * Multipart Upload: 1. Initiate Multipart Upload for large video files
 */
export async function initiateMultipartUpload(params: {
  key: string;
  contentType: string;
}): Promise<{ uploadId: string; key: string }> {
  const command = new CreateMultipartUploadCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.key,
    ContentType: params.contentType,
  });

  const response = await r2Client.send(command);
  if (!response.UploadId) {
    throw new Error("Failed to initialize multipart upload: missing UploadId");
  }

  return { uploadId: response.UploadId, key: params.key };
}

/**
 * Multipart Upload: 2. Generate presigned URL for an individual part
 */
export async function getMultipartUploadPartUrl(params: {
  key: string;
  uploadId: string;
  partNumber: number;
  expiresInSeconds?: number;
}): Promise<{ uploadUrl: string }> {
  const command = new UploadPartCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.key,
    UploadId: params.uploadId,
    PartNumber: params.partNumber,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, {
    expiresIn: params.expiresInSeconds || 3600,
  });

  return { uploadUrl };
}

/**
 * Multipart Upload: 3. Complete Multipart Upload
 */
export async function completeMultipartUpload(params: {
  key: string;
  uploadId: string;
  parts: Array<{ ETag: string; PartNumber: number }>;
}) {
  const command = new CompleteMultipartUploadCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.key,
    UploadId: params.uploadId,
    MultipartUpload: {
      Parts: params.parts.sort((a, b) => a.PartNumber - b.PartNumber),
    },
  });

  return await r2Client.send(command);
}

/**
 * Multipart Upload: 4. Abort Multipart Upload
 */
export async function abortMultipartUpload(params: {
  key: string;
  uploadId: string;
}) {
  const command = new AbortMultipartUploadCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.key,
    UploadId: params.uploadId,
  });

  return await r2Client.send(command);
}

/**
 * Verify object exists in R2 and retrieve metadata
 */
export async function verifyObjectExists(key: string): Promise<{
  exists: boolean;
  contentLength?: number;
  contentType?: string;
}> {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    const head = await r2Client.send(command);
    return {
      exists: true,
      contentLength: head.ContentLength,
      contentType: head.ContentType,
    };
  } catch (err: any) {
    return { exists: false };
  }
}

/**
 * Delete object from R2
 */
export async function deleteR2Object(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    return await r2Client.send(command);
  } catch (err: any) {
    console.error("Failed to delete R2 object:", err);
    throw err;
  }
}

/**
 * Generate short-lived presigned GET URL for secure video playback or PDF download
 */
export async function createPresignedPlaybackUrl(params: {
  key: string;
  expiresInSeconds?: number;
  downloadFilename?: string;
}): Promise<string> {
  // If public domain is configured for public assets (e.g. thumbnails)
  if (R2_PUBLIC_DOMAIN && !params.downloadFilename && !params.key.includes("video")) {
    return `${R2_PUBLIC_DOMAIN.replace(/\/$/, "")}/${params.key}`;
  }

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.key,
    ResponseContentDisposition: params.downloadFilename
      ? `attachment; filename="${params.downloadFilename}"`
      : undefined,
  });

  return await getSignedUrl(r2Client, command, {
    expiresIn: params.expiresInSeconds || 3600, // default 1 hour
  });
}
