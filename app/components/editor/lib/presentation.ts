import type { CSSProperties } from "react";
import type {
  CompositeLayout,
  MediaAlignment,
  MediaPresentation,
  MediaStyle,
  StandaloneLayout,
  WidthPreset,
} from "../types/media-schema";

const WIDTH_PRESETS: WidthPreset[] = [25, 33, 50, 66, 75, 100];

export function normalizeWidthPercent(value: unknown): number {
  if (typeof value === "number" && value > 0 && value <= 100) return value;
  if (typeof value === "string") {
    const n = parseInt(value.replace("%", ""), 10);
    if (!Number.isNaN(n)) return Math.min(100, Math.max(10, n));
  }
  return 100;
}

/** Map legacy size + customWidth → widthPercent */
export function legacySizeToWidth(size?: string, customWidth?: number | null): number {
  if (customWidth) return normalizeWidthPercent(customWidth);
  switch (size) {
    case "sm":
      return 33;
    case "md":
      return 50;
    case "lg":
      return 75;
    case "full":
      return 100;
    default:
      return 100;
  }
}

/** Map legacy image style names → new MediaStyle */
export function normalizeStyle(style?: string): MediaStyle {
  const map: Record<string, MediaStyle> = {
    default: "none",
    rounded: "rounded-lg",
    circle: "rounded-full",
    square: "none",
    shadow: "shadow-lg",
    border: "border",
    card: "card",
    glass: "glass",
    "rounded-lg": "rounded-lg",
    "rounded-xl": "rounded-xl",
    "shadow-sm": "shadow-sm",
    "shadow-md": "shadow-md",
    "shadow-lg": "shadow-lg",
    "shadow-xl": "shadow-xl",
  };
  return map[style ?? ""] ?? "rounded-lg";
}

export function normalizeAlignment(
  alignment?: string,
  layout?: string
): MediaAlignment {
  if (alignment === "full" || layout === "full") return "full";
  if (alignment === "wide" || layout === "wide") return "wide";
  if (alignment === "left" || layout === "float-left") return "left";
  if (alignment === "right" || layout === "float-right") return "right";
  if (alignment === "center") return "center";
  return "center";
}

export function normalizeStandaloneLayout(layout?: string): StandaloneLayout {
  if (layout === "hero") return "hero";
  if (layout === "wide") return "wide";
  if (layout === "full") return "full";
  return "default";
}

export function extractPresentation(attrs: Record<string, unknown>): MediaPresentation {
  return {
    alignment: normalizeAlignment(attrs.alignment as string, attrs.layout as string),
    widthPercent: attrs.widthPercent
      ? normalizeWidthPercent(attrs.widthPercent)
      : legacySizeToWidth(attrs.size as string, attrs.customWidth as number | null),
    style: normalizeStyle(attrs.style as string),
    alt: (attrs.alt as string) ?? "",
    caption: (attrs.caption as string) ?? "",
    credit: (attrs.credit as string) ?? "",
    photographer: (attrs.photographer as string) ?? "",
    sourceUrl: (attrs.sourceUrl as string) ?? "",
    aspectRatio: (attrs.aspectRatio as string) ?? "auto",
  };
}

export function presentationFromAttrs(attrs: Record<string, unknown>): {
  presentation: MediaPresentation;
  layout: StandaloneLayout;
} {
  return {
    presentation: extractPresentation(attrs),
    layout: normalizeStandaloneLayout(attrs.layout as string),
  };
}

export function buildMediaClasses(
  presentation: MediaPresentation,
  layout: StandaloneLayout = "default"
): { figure: string; frame: string; img: string } {
  const { alignment, style } = presentation;
  const width = normalizeWidthPercent(presentation.widthPercent);
  const widthClass =
    width === 100 || layout === "full"
      ? "cms-media--w-full"
      : `cms-media--w-${width}`;

  const figure = [
    "cms-media",
    `cms-media--align-${alignment}`,
    `cms-media--layout-${layout}`,
    widthClass,
    `cms-style--${style}`,
  ].join(" ");

  return {
    figure,
    frame: "cms-media-frame",
    img: "cms-media-img",
  };
}

export function buildMediaStyle(presentation: MediaPresentation): CSSProperties {
  const width = normalizeWidthPercent(presentation.widthPercent);
  if (presentation.alignment === "full" || presentation.alignment === "wide") {
    return {};
  }
  if (!WIDTH_PRESETS.includes(width as WidthPreset) && width !== 100) {
    return { width: `${width}%`, maxWidth: "100%" };
  }
  return {};
}

export function buildCompositeClasses(layout: CompositeLayout): string {
  return `cms-composite cms-composite--${layout}`;
}

export function widthPresetOptions(): WidthPreset[] {
  return WIDTH_PRESETS;
}
