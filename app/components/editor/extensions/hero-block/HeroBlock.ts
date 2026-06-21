import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import HeroBlockView from "./HeroBlockView";
import { attr, editorOnlyAttr } from "../shared/attrs";
import { createBlockId } from "../../lib/block-id";

export const HeroBlock = Node.create({
  name: "heroBlock",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      id: attr(""),
      src: attr(null),
      title: attr(""),
      subtitle: attr(""),
      overlay: attr(true),
      height: attr("lg"),
      uploadStatus: editorOnlyAttr("idle"),
      uploadProgress: editorOnlyAttr(0),
    };
  },

  parseHTML() {
    return [{ tag: 'section[data-type="hero-block"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const a = node.attrs;
    return [
      "section",
      mergeAttributes(HTMLAttributes, {
        "data-type": "hero-block",
        class: `cms-hero cms-hero-${a.height}`,
      }),
      [
        "div",
        { class: "cms-hero-media" },
        a.src ? ["img", { src: a.src, class: "cms-hero-img", alt: "" }] : "",
        a.overlay ? ["div", { class: "cms-hero-overlay" }] : "",
        [
          "div",
          { class: "cms-hero-text" },
          a.title ? ["h2", { class: "cms-hero-title" }, a.title] : "",
          a.subtitle ? ["p", { class: "cms-hero-subtitle" }, a.subtitle] : "",
        ],
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(HeroBlockView);
  },

  addCommands() {
    return {
      insertHeroBlock:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { id: createBlockId(), overlay: true, height: "lg" },
          }),
    };
  },
});

export default HeroBlock;
