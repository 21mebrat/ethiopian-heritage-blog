import type {
  GalleryLayout,
  ImageStyle,
  MediaAlignment,
  MediaSize,
} from "../types/blocks";

/** Alignment wrapper for any media block */
export function alignmentClass(alignment: MediaAlignment): string {
  const map: Record<MediaAlignment, string> = {
    left: "cms-align-left",
    center: "cms-align-center",
    right: "cms-align-right",
    full: "cms-align-full",
    wide: "cms-align-wide",
    inline: "cms-align-inline",
  };
  return map[alignment] ?? "cms-align-center";
}

export function sizeClass(size: MediaSize, customWidth?: number | null): string {
  if (size === "custom" && customWidth) {
    return "cms-size-custom";
  }
  const map: Record<MediaSize, string> = {
    sm: "cms-size-sm",
    md: "cms-size-md",
    lg: "cms-size-lg",
    full: "cms-size-full",
    custom: "cms-size-md",
  };
  return map[size] ?? "cms-size-lg";
}

export function imageStyleClass(style: ImageStyle): string {
  const map: Record<ImageStyle, string> = {
    default: "cms-img-default",
    rounded: "cms-img-rounded",
    circle: "cms-img-circle",
    square: "cms-img-square",
    shadow: "cms-img-shadow",
    border: "cms-img-border",
    card: "cms-img-card",
    glass: "cms-img-glass",
  };
  return map[style] ?? "cms-img-rounded";
}

export function galleryLayoutClass(layout: GalleryLayout): string {
  const map: Record<GalleryLayout, string> = {
    "grid-2": "cms-gallery-grid-2",
    "grid-3": "cms-gallery-grid-3",
    masonry: "cms-gallery-masonry",
    carousel: "cms-gallery-carousel",
  };
  return map[layout] ?? "cms-gallery-grid-2";
}

export function layoutModifier(layout: string): string {
  if (layout === "float-left") return "cms-layout-float-left";
  if (layout === "float-right") return "cms-layout-float-right";
  if (layout === "hero") return "cms-layout-hero";
  if (layout === "above-text") return "cms-layout-above";
  if (layout === "below-text") return "cms-layout-below";
  return "";
}

import type { CSSProperties } from "react";

export function customWidthStyle(customWidth: number | null): CSSProperties {
  if (!customWidth) return {};
  return { width: `${Math.min(100, Math.max(10, customWidth))}%` };
}
