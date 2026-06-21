import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CalloutBlockView from "./CalloutBlockView";
import { attr } from "../shared/attrs";
import { createBlockId } from "../../lib/block-id";

export const CalloutBlock = Node.create({
  name: "calloutBlock",
  group: "block",
  content: "block+",
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: attr(""),
      variant: attr("info"),
      emoji: attr("💡"),
    };
  },

  parseHTML() {
    return [{ tag: 'aside[data-type="callout-block"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "aside",
      mergeAttributes(HTMLAttributes, {
        "data-type": "callout-block",
        class: `cms-callout cms-callout-${node.attrs.variant}`,
        "data-variant": node.attrs.variant,
      }),
      ["div", { class: "cms-callout-inner" }, ["span", { class: "cms-callout-emoji" }, node.attrs.emoji], ["div", { class: "cms-callout-content" }, 0]],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutBlockView);
  },

  addCommands() {
    return {
      insertCalloutBlock:
        () =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { id: createBlockId() },
            content: [{ type: "paragraph" }],
          }),
    };
  },
});

export default CalloutBlock;
