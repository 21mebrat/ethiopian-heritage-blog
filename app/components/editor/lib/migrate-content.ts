import type { JSONContent } from "@tiptap/core";
import { createBlockId } from "./block-id";
import { legacySizeToWidth, normalizeStyle, normalizeAlignment } from "./presentation";
import { normalizeMediaLayout, normalizeOverlay, parseHero } from "./media-attrs";

function migrateAttrs(attrs: Record<string, unknown>): Record<string, unknown> {
  const next = { ...attrs };

  if (next.widthPercent === undefined) {
    next.widthPercent = legacySizeToWidth(next.size as string, next.customWidth as number | null);
  }

  if (next.style) {
    next.style = normalizeStyle(next.style as string);
  }

  if (next.alignment) {
    next.alignment = normalizeAlignment(next.alignment as string, next.layout as string);
  }

  if (!next.mediaLayout) {
    next.mediaLayout = normalizeMediaLayout(next.mediaLayout as string, next.layout as string);
  }
  if (!next.overlay) next.overlay = normalizeOverlay(next.overlay as string);
  if (next.overlayOpacity === undefined) next.overlayOpacity = 40;
  if (!next.hero) next.hero = parseHero(next);

  return next;
}

/** Migrates legacy nodes and normalizes presentation attrs */
export function migrateEditorContent(content: JSONContent | null | undefined): JSONContent {
  if (!content || content.type !== "doc") {
    return { type: "doc", content: [] };
  }

  const migrateNode = (node: JSONContent): JSONContent => {
    if (node.type === "image") {
      const attrs = migrateAttrs({
        id: createBlockId(),
        src: node.attrs?.src ?? null,
        alt: node.attrs?.alt ?? "",
        alignment: "center",
        widthPercent: 100,
        style: "rounded-lg",
        layout: "default",
      });
      return { type: "imageBlock", attrs };
    }

    if (node.type === "video") {
      const attrs = migrateAttrs({
        id: createBlockId(),
        src: node.attrs?.src ?? null,
        provider: "mp4",
        controls: true,
        alignment: "center",
        widthPercent: 100,
        style: "rounded-lg",
      });
      return { type: "videoBlock", attrs };
    }

    if (node.attrs && typeof node.attrs === "object") {
      const migrated = migrateAttrs(node.attrs as Record<string, unknown>);

      if (node.type === "mediaTextBlock") {
        if (!migrated.layout) {
          migrated.layout =
            migrated.imageSide === "right" ? "side-right" : "side-left";
        }
      }

      const withAttrs = { ...node, attrs: migrated };
      if (node.content?.length) {
        return { ...withAttrs, content: node.content.map(migrateNode) };
      }
      return withAttrs;
    }

    if (node.content?.length) {
      return { ...node, content: node.content.map(migrateNode) };
    }

    return node;
  };

  return {
    type: "doc",
    content: (content.content ?? []).map(migrateNode),
  };
}
