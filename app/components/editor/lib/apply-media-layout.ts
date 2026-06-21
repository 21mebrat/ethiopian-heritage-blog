import type { Editor } from "@tiptap/react";
import type { MediaLayout } from "../types/media-schema";
import { isCompositeLayout } from "./media-attrs";
import { createBlockId } from "./block-id";
import type { SelectedMedia } from "./media-selection";
import { patchMediaAttrs } from "./patch-media-attrs";

/** Apply layout — composite layouts convert to mediaTextBlock */
export function applyMediaLayout(
  editor: Editor,
  selected: SelectedMedia,
  layout: MediaLayout
): void {
  const attrs = selected.attrs;

  if (!isCompositeLayout(layout)) {
    patchMediaAttrs(editor, selected.pos, {
      mediaLayout: layout,
      layout:
        layout === "wide"
          ? "wide"
          : layout === "full"
            ? "full"
            : layout === "hero"
              ? "hero"
              : "default",
      hero:
        layout === "hero"
          ? {
              ...(typeof attrs.hero === "object" && attrs.hero ? attrs.hero : {}),
              enabled: true,
            }
          : attrs.hero,
    });
    return;
  }

  const imageSrc = (attrs.src as string) ?? null;
  const isVideo = selected.type === "videoBlock";

  if (isVideo && !imageSrc) {
    patchMediaAttrs(editor, selected.pos, { mediaLayout: layout });
    return;
  }

  const compositeLayout = layout === "text-wrap" ? "float-left" : layout;

  editor
    .chain()
    .command(({ tr, state }) => {
      const node = state.doc.nodeAt(selected.pos);
      if (!node) return false;

      const mediaTextBlockType = state.schema.nodes.mediaTextBlock;
      if (!mediaTextBlockType) {
        // Fallback: just patch attrs if schema doesn't have mediaTextBlock
        patchMediaAttrs(editor, selected.pos, { mediaLayout: layout });
        return true;
      }

      const paragraphNode = state.schema.nodes.paragraph.create();
      const newNode = mediaTextBlockType.create(
        {
          id: createBlockId(),
          layout: compositeLayout,
          imageSrc: imageSrc ?? attrs.imageSrc,
          alt: attrs.alt ?? "",
          caption: attrs.caption ?? "",
          widthPercent: attrs.widthPercent ?? 42,
          imageStyle: attrs.style ?? "rounded-lg",
          style: attrs.style,
          alignment: attrs.alignment,
          overlay: attrs.overlay,
          overlayOpacity: attrs.overlayOpacity,
          hero: attrs.hero,
          heightPx: attrs.heightPx ?? null,
        },
        [paragraphNode]
      );

      tr.replaceWith(selected.pos, selected.pos + node.nodeSize, newNode);
      return true;
    })
    .run();
}
