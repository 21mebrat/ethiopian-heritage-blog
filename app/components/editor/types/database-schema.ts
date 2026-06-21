/**
 * Production MongoDB shape for CMS content (stored inside Post.content as Tiptap JSON).
 * Each block node carries attrs matching these interfaces — no separate tables required
 * until you need asset management / CDN analytics at scale.
 */

export interface MediaAssetRecord {
  _id: string;
  publicId: string;
  url: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  uploadedBy: string;
  createdAt: Date;
}

/** Denormalized snapshot inside Tiptap JSON (source of truth for layout) */
export interface StoredImageBlock {
  type: "imageBlock";
  attrs: {
    id: string;
    src: string;
    alt?: string;
    caption?: string;
    credit?: string;
    photographer?: string;
    sourceUrl?: string;
    alignment?: string;
    size?: string;
    customWidth?: number | null;
    style?: string;
    layout?: string;
  };
}

export interface StoredGalleryBlock {
  type: "galleryBlock";
  attrs: {
    id: string;
    layout: "grid-2" | "grid-3" | "masonry" | "carousel";
    items: Array<{
      id: string;
      src: string;
      alt?: string;
      caption?: string;
    }>;
    caption?: string;
    alignment?: string;
  };
}

export interface StoredVideoBlock {
  type: "videoBlock";
  attrs: {
    id: string;
    src?: string;
    provider: "cloudinary" | "mp4" | "youtube" | "vimeo";
    embedUrl?: string;
    poster?: string;
    caption?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    alignment?: string;
    size?: string;
  };
}

/**
 * Future: optional `media_assets` collection + reference by id in attrs.srcAssetId
 * for deduplication across posts when you reach thousands of articles.
 */
