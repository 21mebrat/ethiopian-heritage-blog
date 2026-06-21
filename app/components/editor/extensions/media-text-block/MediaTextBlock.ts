import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import MediaTextBlockView from "./MediaTextBlockView";
import { attr, editorOnlyAttr } from "../shared/attrs";
import { createBlockId } from "../../lib/block-id";
import { buildCompositeClasses } from "../../lib/presentation";
import type { CompositeLayout } from "../../types/media-schema";

export const MediaTextBlock = Node.create({
  name: "mediaTextBlock",
  group: "block",
  content: "block+",
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: attr(""),
      layout: attr("side-left"),
      imageSrc: attr(null),
      imageSide: editorOnlyAttr("left"),
      alt: attr(""),
      caption: attr(""),
      credit: attr(""),
      photographer: attr(""),
      sourceUrl: attr(""),
      alignment: attr("left"),
      widthPercent: attr(42),
      imageStyle: attr("rounded-lg"),
      style: editorOnlyAttr("rounded-lg"),
      imageSize: editorOnlyAttr("md"),
      uploadStatus: editorOnlyAttr("idle"),
      uploadProgress: editorOnlyAttr(0),
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="media-text-block"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const layout = (node.attrs.layout as CompositeLayout) ?? "side-left";
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "media-text-block",
        class: buildCompositeClasses(layout),
        "data-layout": layout,
      }),
      [
        "div",
        { class: "cms-composite-media" },
        node.attrs.imageSrc
          ? ["img", { src: node.attrs.imageSrc, alt: node.attrs.alt ?? "", class: "cms-media-img" }]
          : "",
      ],
      ["div", { class: "cms-composite-body" }, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(MediaTextBlockView);
  },

  addCommands() {
    return {
      insertMediaTextBlock:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { id: createBlockId(), layout: "side-left", widthPercent: 42 },
            content: [{ type: "paragraph" }],
          }),
    };
  },
});

export default MediaTextBlock;
