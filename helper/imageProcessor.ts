import { decode as base64Decode } from "https://deno.land/std@0.208.0/encoding/base64.ts";
import * as imagescript from "https://deno.land/x/imagescript@1.3.0/mod.ts";
import log from "./log.ts";
import getAccessToken from "./getAccessToken.ts";
import projectId from "../db/projectId.ts";

/* ──────────────────────────────────────────────────────────
   Firebase Storage configuration
   ──────────────────────────────────────────────────────────*/
function resolveBucket(id: string): string {
  // Already a full bucket id?
  if (id.endsWith(".appspot.com") || id.endsWith(".firebasestorage.app")) {
    return id;
  }
  // Use the new-style bucket first
  return `${id}.firebasestorage.app`;
}

const rawBucket = Deno.env.get("FIREBASE_STORAGE_BUCKET") || projectId;
export const FIREBASE_STORAGE_BUCKET = resolveBucket(rawBucket);

const FIREBASE_STORAGE_UPLOAD_URL_BASE =
  "https://storage.googleapis.com/upload/storage/v1/b";

// **Use the Firebase serving endpoint for public reads**
const FIREBASE_STORAGE_PUBLIC_URL_BASE =
  "https://firebasestorage.googleapis.com/v0/b";

/* ──────────────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────────────────*/
interface DecodedImage {
  buffer: Uint8Array;
  extension: string;
}

/* ──────────────────────────────────────────────────────────
   Helper – decode base64
   ──────────────────────────────────────────────────────────*/
async function decodeBase64Image(base64Image: string): Promise<DecodedImage | null> {
  try {
    const parts = base64Image.match(/^data:image\/([a-zA-Z+]+);base64,(.*)$/);
    if (!parts || parts.length !== 3) {
      log(
        "[ImageProcessor] Error: Invalid base64 image format. " +
          `Received: ${base64Image.substring(0, 50)}…`,
        "error",
      );
      return null;
    }

    const mimeType = parts[1];
    const buffer = base64Decode(parts[2]);

    let extension = mimeType.toLowerCase();
    if (extension === "jpeg") extension = "jpg";
    if (!["png", "jpg", "gif", "webp"].includes(extension)) {
      log(
        `[ImageProcessor] Error: Unsupported image type: ${mimeType}. Only png, jpg, gif and webp are supported.`,
        "error",
      );
      return null;
    }

    log(
      `[ImageProcessor] Base64 decoded. Type: ${mimeType}, bytes: ${buffer.length}`,
      "debug",
    );
    return { buffer, extension };
  } catch (error) {
    log(
      `[ImageProcessor] Error during base64 decoding: ${
        error instanceof Error ? error.message : String(error)
      }`,
      "error",
    );
    return null;
  }
}

/* ──────────────────────────────────────────────────────────
   Helper – image resize
   ──────────────────────────────────────────────────────────*/
async function resizeImageInternal(
  image: imagescript.Image,
  targetWidth: number,
): Promise<Uint8Array | null> {
  try {
    if (image.width <= targetWidth) {
      return await image.encode(0); // PNG
    }
    const targetHeight = Math.round(targetWidth * (image.height / image.width));
    image.resize(targetWidth, targetHeight);
    return await image.encode(0);
  } catch (err) {
    log(`[ImageProcessor] Internal resize error: ${err}`, "error");
    return null;
  }
}

async function resizeImage(
  buffer: Uint8Array,
  targetWidth: number,
): Promise<Uint8Array | null> {
  try {
    const img = await imagescript.Image.decode(buffer);
    if (img.width <= targetWidth) return await img.encode(0);
    img.resize(targetWidth, Math.round(targetWidth * (img.height / img.width)));
    return await img.encode(0);
  } catch (err) {
    log(`[ImageProcessor] Resize error: ${err}`, "error");
    return null;
  }
}

/* ──────────────────────────────────────────────────────────
   Helper – hash
   ──────────────────────────────────────────────────────────*/
async function generateImageHash(buffer: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ──────────────────────────────────────────────────────────
   Helper – upload to Storage (JSON API)
   ──────────────────────────────────────────────────────────*/
async function uploadToFirebaseStorage(
  imageBuffer: Uint8Array,
  fileName: string,
  contentType: string,
): Promise<{ url: string | null; error?: string }> {
  let accessToken: string | null = null;
  try {
    accessToken = await getAccessToken();
    if (!accessToken) {
      return { url: null, error: "Unable to obtain Firebase access token." };
    }

    const encodedName = encodeURIComponent(fileName);
    // **publicRead makes the object world-readable**
    const uploadUrl =
      `${FIREBASE_STORAGE_UPLOAD_URL_BASE}/${FIREBASE_STORAGE_BUCKET}` +
      `/o?uploadType=media&name=${encodedName}&predefinedAcl=publicRead`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": contentType,
        "Content-Length": imageBuffer.length.toString(),
      },
      body: imageBuffer,
    });

    if (!res.ok) {
      const body = await res.text();
      return {
        url: null,
        error: `Upload failed (${res.status}): ${body}`,
      };
    }

    // Firebase serving URL (works with or without the ACL)
    const publicUrl =
      `${FIREBASE_STORAGE_PUBLIC_URL_BASE}/${FIREBASE_STORAGE_BUCKET}` +
      `/o/${encodedName}?alt=media`;

    return { url: publicUrl };
  } catch (err) {
    return {
      url: null,
      error: `Unexpected upload error: ${err instanceof Error ? err.message : String(err)}`,
    };
  } finally {
    log("[ImageProcessor] Image upload attempt completed.", "debug");
  }
}

/* ──────────────────────────────────────────────────────────
   Main – process & upload
   ──────────────────────────────────────────────────────────*/
export async function processAndUploadImage(
  base64Image: string,
  configId: string,
): Promise<string | null> {
  log(`[ImageProcessor] Processing image for configId: ${configId}`, "info");

  const decoded = await decodeBase64Image(base64Image);
  if (!decoded) return null;

  let buffer: Uint8Array | null = null;
  let contentType = `image/${decoded.extension}`;

  if (decoded.extension === "webp") {
    try {
      const png = await imagescript.Image.decode(decoded.buffer).then((i) => i.encode(0));
      buffer =
        (await resizeImageInternal(await imagescript.Image.decode(png), 400)) ??
        png;
      contentType = "image/png";
    } catch (e) {
      log(`[ImageProcessor] WebP→PNG error: ${e}`, "error");
      buffer = decoded.buffer; // fallback
    }
  } else {
    buffer = (await resizeImage(decoded.buffer, 400)) ?? decoded.buffer;
    if (buffer !== decoded.buffer) contentType = "image/png";
  }

  if (!buffer) return null;

  const timestamp = Date.now();
  const hash = await generateImageHash(buffer);
  const ext = contentType.split("/")[1] || decoded.extension;
  const fileName = `logos/${configId}/${timestamp}_${hash}.${ext}`;

  const { url, error } = await uploadToFirebaseStorage(buffer, fileName, contentType);
  if (error) {
    log(`[ImageProcessor] Upload error: ${error}`, "error");
    return null;
  }
  log(`[ImageProcessor] File available at: ${url}`, "info");
  return url;
}
