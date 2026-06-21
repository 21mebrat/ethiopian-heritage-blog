/** Upload lifecycle shared by image/video blocks */
export type UploadStatus = "idle" | "uploading" | "success" | "error";

export type MediaAlignment =
  | "left"
  | "center"
  | "right"
  | "full"
  | "wide"
  | "inline";

export type MediaSize = "sm" | "md" | "lg" | "full" | "custom";

export type ImageStyle =
  | "default"
  | "rounded"
  | "circle"
  | "square"
  | "shadow"
  | "border"
  | "card"
  | "glass";

export type ImageLayout =
  | "single"
  | "float-left"
  | "float-right"
  | "above-text"
  | "below-text"
  | "hero";

export type GalleryLayout =
  | "grid-2"
  | "grid-3"
  | "masonry"
  | "carousel";

export type VideoProvider = "cloudinary" | "mp4" | "youtube" | "vimeo";

export interface ImageMetadata {
  alt: string;
  caption: string;
  credit: string;
  photographer: string;
  sourceUrl: string;
}

export interface GalleryItem extends ImageMetadata {
  id: string;
  src: string;
  width?: number | null;
  height?: number | null;
}

export interface ImageBlockAttrs extends ImageMetadata {
  id: string;
  src: string | null;
  uploadStatus: UploadStatus;
  uploadProgress: number;
  uploadError: string | null;
  alignment: MediaAlignment;
  size: MediaSize;
  customWidth: number | null;
  style: ImageStyle;
  layout: ImageLayout;
}

export interface VideoBlockAttrs {
  id: string;
  src: string | null;
  provider: VideoProvider;
  embedUrl: string | null;
  uploadStatus: UploadStatus;
  uploadProgress: number;
  uploadError: string | null;
  poster: string | null;
  thumbnail: string | null;
  caption: string;
  alignment: MediaAlignment;
  size: MediaSize;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
}

export interface GalleryBlockAttrs {
  id: string;
  layout: GalleryLayout;
  items: GalleryItem[];
  caption: string;
  alignment: MediaAlignment;
}

export interface CalloutBlockAttrs {
  id: string;
  variant: "info" | "warning" | "success" | "tip";
  emoji: string;
}

export interface HeroBlockAttrs {
  id: string;
  src: string | null;
  title: string;
  subtitle: string;
  overlay: boolean;
  height: "sm" | "md" | "lg" | "full";
  uploadStatus: UploadStatus;
  uploadProgress: number;
}

export interface MediaTextBlockAttrs extends ImageMetadata {
  id: string;
  imageSrc: string | null;
  imageSide: "left" | "right";
  imageSize: MediaSize;
  imageStyle: ImageStyle;
  uploadStatus: UploadStatus;
  uploadProgress: number;
}

export const DEFAULT_IMAGE_ATTRS: ImageBlockAttrs = {
  id: "",
  src: null,
  uploadStatus: "idle",
  uploadProgress: 0,
  uploadError: null,
  alt: "",
  caption: "",
  credit: "",
  photographer: "",
  sourceUrl: "",
  alignment: "center",
  size: "lg",
  customWidth: null,
  style: "rounded",
  layout: "single",
};

export const DEFAULT_VIDEO_ATTRS: VideoBlockAttrs = {
  id: "",
  src: null,
  provider: "mp4",
  embedUrl: null,
  uploadStatus: "idle",
  uploadProgress: 0,
  uploadError: null,
  poster: null,
  thumbnail: null,
  caption: "",
  alignment: "center",
  size: "lg",
  autoplay: false,
  loop: false,
  muted: false,
  controls: true,
};
