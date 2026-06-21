import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageBlockView from "./ImageBlockView";
import { attr, editorOnlyAttr, objectAttr } from "../shared/attrs";
import { createBlockId } from "../../lib/block-id";
import { buildMediaClasses, presentationFromAttrs } from "../../lib/presentation";
import { DEFAULT_HERO } from "../../types/media-schema";

export const ImageBlock = Node.create({
  name: "imageBlock",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      id: attr(""),
      src: attr(null),
      uploadStatus: editorOnlyAttr("idle"),
      uploadProgress: editorOnlyAttr(0),
      uploadError: editorOnlyAttr(null),
      alt: attr(""),
      caption: attr(""),
      credit: attr(""),
      photographer: attr(""),
      sourceUrl: attr(""),
      alignment: attr("center"),
      widthPercent: attr(100),
      aspectRatio: attr("auto"),
      heightPx: attr(null),
      style: attr("rounded-lg"),
      layout: attr("default"),
      mediaLayout: attr("media-only"),
      overlay: attr("none"),
      overlayOpacity: attr(40),
      hero: objectAttr("hero", { ...DEFAULT_HERO }),
      size: editorOnlyAttr("lg"),
      customWidth: editorOnlyAttr(null),
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-type="image-block"]' }, { tag: "figure.cms-media" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const a = node.attrs;
    const { presentation, layout } = presentationFromAttrs(a);
    const classes = buildMediaClasses(presentation, layout);

    const ratio = a.aspectRatio || "auto";
    const styles = [
      a.widthPercent ? `width: ${a.widthPercent}%` : "",
      ratio !== "auto" ? `aspect-ratio: ${ratio}` : "",
    ].filter(Boolean).join("; ");

    const children: (string | [string, ...unknown[]])[] = [];
    if (a.src) {
      children.push(["div", { class: "cms-media-frame" }, ["img", { src: a.src, alt: presentation.alt || "", class: "cms-media-img" }]]);
    }
    if (presentation.caption) {
      children.push(["figcaption", { class: "cms-media-caption" }, ["span", { class: "cms-media-caption-text" }, presentation.caption]]);
    }

    return [
      "figure",
      mergeAttributes(HTMLAttributes, {
        "data-type": this.name,
        class: classes.figure,
        style: styles,
        "data-aspect-ratio": ratio,
        "data-alignment": presentation.alignment,
        "data-width": presentation.widthPercent,
        "data-style": presentation.style,
        "data-layout": layout,
      }),
      ...children,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockView);
  },

  addCommands() {
    return {
      insertImageBlock:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { id: createBlockId(), widthPercent: 100, style: "rounded-lg", layout: "default" },
          }),
    };
  },
});

export default ImageBlock;
