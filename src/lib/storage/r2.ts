import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "prince-commerce-storage";
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || "";

export const isR2Configured = Boolean(
  R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME
);

// S3-compatible client for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ACCOUNT_ID
    ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : "https://placeholder-account.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "placeholder-access-key",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "placeholder-secret-key",
  },
});

/**
 * Generate a folder path and key according to content type and subject
 */
export function buildR2ObjectKey(params: {
  contentType: "video" | "pdf" | "thumbnail" | "assignment" | "other";
  subject?: string;
  filename: string;
}): string {
  const sanitizedFilename = params.filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "-")
    .replace(/-+/g, "-");
  const timestamp = Date.now();
  const subjectSlug = (params.subject || "accountancy")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");

  switch (params.contentType) {
    case "video":
      return `recordings/${subjectSlug}/${timestamp}-${sanitizedFilename}`;
    case "pdf":
    case "other":
      return `notes/${subjectSlug}/${timestamp}-${sanitizedFilename}`;
    case "assignment":
      return `assignments/${subjectSlug}/${timestamp}-${sanitizedFilename}`;
    case "thumbnail":
      return `thumbnails/${timestamp}-${sanitizedFilename}`;
    default:
      return `resources/${timestamp}-${sanitizedFilename}`;
  }
}

/**
 * Generate presigned PUT URL for direct browser-to-R2 upload
 */
export async function createPresignedUploadUrl(params: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<{ uploadUrl: string; key: string }> {
  if (!isR2Configured) {
    // Development fallback URL when R2 keys aren't added to env yet
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
 * Generate short-lived presigned GET URL for secure video streaming or PDF download
 */
export async function createPresignedPlaybackUrl(params: {
  key: string;
  expiresInSeconds?: number;
  downloadFilename?: string;
}): Promise<string> {
  if (!isR2Configured) {
    // If key starts with /images/ or public path, return it directly
    if (params.key.startsWith("/")) return params.key;
    // Development fallback video/pdf
    if (params.key.includes("recordings/")) {
      return "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    }
    return `/sample-resource.pdf`;
  }

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: params.key,
    ResponseContentDisposition: params.downloadFilename
      ? `attachment; filename="${params.downloadFilename}"`
      : "inline",
  });

  return await getSignedUrl(r2Client, command, {
    expiresIn: params.expiresInSeconds || 3600, // 1 hour playback window
  });
}

/**
 * Delete an object from R2
 */
export async function deleteR2Object(key: string): Promise<boolean> {
  if (!isR2Configured) return true;

  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error("Failed to delete R2 object:", error);
    return false;
  }
}
