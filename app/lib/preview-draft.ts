import { randomBytes } from "crypto";

const PREVIEW_TTL_MS = 60 * 60 * 1000; // 1 hour

export function createPreviewCredentials() {
  return {
    previewId: randomBytes(16).toString("hex"),
    previewSecret: randomBytes(24).toString("hex"),
    expiresAt: new Date(Date.now() + PREVIEW_TTL_MS),
  };
}

export function getPreviewTtlMs() {
  return PREVIEW_TTL_MS;
}
