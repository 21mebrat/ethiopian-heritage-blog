import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import GalleryBlockView from "./GalleryBlockView";
import { attr } from "../shared/attrs";
import { createBlockId } from "../../lib/block-id";
import { galleryLayoutClass, alignmentClass } from "../../lib/layout-classes";

export const GalleryBlock = Node.create({
  name: "galleryBlock",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      id: attr(""),
      layout: attr("grid-2"),
      items: { default: [] },
      caption: attr(""),
      alignment: attr("center"),
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-type="gallery-block"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const a = node.attrs;
    const classes = [
      "cms-gallery-block",
      alignmentClass(a.alignment),
      galleryLayoutClass(a.layout),
    ].join(" ");

    const items = (a.items ?? []).map((item: { src: string; alt?: string; caption?: string }) => [
      "div",
      { class: "cms-gallery-item" },
      ["img", { src: item.src, alt: item.alt ?? "" }],
      item.caption ? ["span", { class: "cms-gallery-item-caption" }, item.caption] : "",
    ]);

    return [
      "figure",
      mergeAttributes(HTMLAttributes, { "data-type": "gallery-block", class: classes }),
      ["div", { class: "cms-gallery-grid" }, ...items],
      a.caption ? ["figcaption", { class: "cms-caption" }, a.caption] : "",
    ].filter(Boolean) as [string, ...unknown[]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(GalleryBlockView);
  },

  addCommands() {
    return {
      insertGalleryBlock:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { id: createBlockId(), items: [], layout: "grid-2" },
          }),
    };
  },
});

export default GalleryBlock;
