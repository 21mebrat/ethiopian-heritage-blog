/**
 * Unified media document schema — stored in Tiptap node attrs (imageBlock | videoBlock | mediaTextBlock).
 */

export type MediaType = "image" | "video";

export type MediaAlignment = "left" | "center" | "right" | "full" | "wide";

export type WidthPreset = 25 | 33 | 50 | 66 | 75 | 100;

export type MediaStyle =
  | "none"
  | "rounded"
  | "rounded-lg"
  | "rounded-xl"
  | "rounded-full"
  | "shadow-sm"
  | "shadow-md"
  | "shadow-lg"
  | "shadow-xl"
  | "border"
  | "glass"
  | "card";

export type MediaOverlay = "none" | "dark" | "light" | "gradient" | "blur";

export type MediaLayout =
  | "media-only"
  | "wide"
  | "full"
  | "stack-top"
  | "stack-bottom"
  | "side-left"
  | "side-right"
  | "float-left"
  | "float-right"
  | "text-wrap"
  | "hero";

export type HeroTextPosition = "left" | "center" | "right" | "bottom";

export interface MediaCaptionMeta {
  alt: string;
  caption: string;
  credit: string;
  photographer: string;
  sourceUrl: string;
}

export interface HeroConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  buttonLabel: string;
  buttonHref: string;
  textPosition: HeroTextPosition;
}

export interface MediaBlockAttrs extends MediaCaptionMeta {
  id: string;
  mediaType: MediaType;
  src: string | null;
  alignment: MediaAlignment;
  widthPercent: WidthPreset | number;
  style: MediaStyle;
  aspectRatio: string;
  layout: MediaLayout;
  overlay: MediaOverlay;
  overlayOpacity: number;
  hero: HeroConfig;
  // video-specific
  provider?: "cloudinary" | "mp4" | "youtube" | "vimeo";
  embedUrl?: string | null;
  poster?: string | null;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export const DEFAULT_HERO: HeroConfig = {
  enabled: false,
  title: "",
  subtitle: "",
  buttonLabel: "",
  buttonHref: "",
  textPosition: "center",
};

export const DEFAULT_MEDIA_ATTRS: Partial<MediaBlockAttrs> = {
  alignment: "center",
  widthPercent: 100,
  style: "rounded-lg",
  layout: "media-only",
  overlay: "none",
  overlayOpacity: 40,
  hero: DEFAULT_HERO,
  alt: "",
  caption: "",
  credit: "",
  photographer: "",
  sourceUrl: "",
  aspectRatio: "auto",
};

export interface MediaPresentation extends MediaCaptionMeta {
  alignment: MediaAlignment;
  widthPercent: WidthPreset | number;
  style: MediaStyle;
  aspectRatio: string;
}

export type StandaloneLayout = "default" | "wide" | "full" | "hero";
export type CompositeLayout =
  | "side-left"
  | "side-right"
  | "stack-top"
  | "stack-bottom"
  | "float-left"
  | "float-right";
