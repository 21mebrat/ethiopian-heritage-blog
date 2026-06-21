import type {
  HeroConfig,
  MediaLayout,
  MediaOverlay,
  MediaPresentation,
} from "../types/media-schema";
import { DEFAULT_HERO, DEFAULT_MEDIA_ATTRS } from "../types/media-schema";
import {
  extractPresentation,
  legacySizeToWidth,
  normalizeAlignment,
  normalizeStyle,
  normalizeStandaloneLayout,
} from "./presentation";

export function normalizeOverlay(v?: string): MediaOverlay {
  const allowed: MediaOverlay[] = ["none", "dark", "light", "gradient", "blur"];
  return allowed.includes(v as MediaOverlay) ? (v as MediaOverlay) : "none";
}

export function normalizeMediaLayout(v?: string, legacyLayout?: string): MediaLayout {
  const map: Record<string, MediaLayout> = {
    "media-only": "media-only",
    default: "media-only",
    single: "media-only",
    wide: "wide",
    full: "full",
    hero: "hero",
    "stack-top": "stack-top",
    "stack-bottom": "stack-bottom",
    "side-left": "side-left",
    "side-right": "side-right",
    "float-left": "float-left",
    "float-right": "float-right",
    "text-wrap": "text-wrap",
    "above-text": "stack-top",
    "below-text": "stack-bottom",
  };
  return map[v ?? ""] ?? map[legacyLayout ?? ""] ?? "media-only";
}

export function parseHero(attrs: Record<string, unknown>): HeroConfig {
  const layoutHero =
    attrs.mediaLayout === "hero" || attrs.layout === "hero";
  const hero = attrs.hero as HeroConfig | undefined;
  if (hero && typeof hero === "object") {
    return {
      ...DEFAULT_HERO,
      ...hero,
      enabled: Boolean(hero.enabled || layoutHero),
    };
  }
  if (attrs.heroEnabled) {
    return {
      ...DEFAULT_HERO,
      enabled: true,
      title: (attrs.heroTitle as string) ?? "",
      subtitle: (attrs.heroSubtitle as string) ?? "",
      buttonLabel: (attrs.heroButtonLabel as string) ?? "",
      buttonHref: (attrs.heroButtonHref as string) ?? "",
      textPosition: (attrs.heroTextPosition as HeroConfig["textPosition"]) ?? "center",
    };
  }
  return { ...DEFAULT_HERO };
}

export function attrsToPresentation(attrs: Record<string, unknown>): MediaPresentation {
  return extractPresentation(attrs);
}

export function presentationFromAttrs(attrs: Record<string, unknown>) {
  const presentation = extractPresentation(attrs);
  const standalone = normalizeStandaloneLayout(
    (attrs.mediaLayout as string) ?? (attrs.layout as string)
  );
  return {
    presentation,
    layout: standalone,
    mediaLayout: normalizeMediaLayout(attrs.mediaLayout as string, attrs.layout as string),
    overlay: normalizeOverlay(attrs.overlay as string),
    overlayOpacity: Math.min(
      95,
      Math.max(5, Number(attrs.overlayOpacity) || 40)
    ),
    hero: parseHero(attrs),
  };
}

export const COMPOSITE_LAYOUTS = [
  "stack-top",
  "stack-bottom",
  "side-left",
  "side-right",
  "float-left",
  "float-right",
  "text-wrap",
] as const;

export function isCompositeLayout(layout: MediaLayout): boolean {
  return (COMPOSITE_LAYOUTS as readonly string[]).includes(layout);
}

export function ensureMediaDefaults(attrs: Record<string, unknown>): Record<string, unknown> {
  return {
    ...DEFAULT_MEDIA_ATTRS,
    widthPercent: attrs.widthPercent ?? legacySizeToWidth(attrs.size as string, attrs.customWidth as number | null),
    style: normalizeStyle(attrs.style as string),
    alignment: normalizeAlignment(attrs.alignment as string, attrs.layout as string),
    mediaLayout: normalizeMediaLayout(attrs.mediaLayout as string, attrs.layout as string),
    overlay: normalizeOverlay(attrs.overlay as string),
    overlayOpacity: attrs.overlayOpacity ?? 40,
    hero: parseHero(attrs),
    ...attrs,
  };
}
