import { Node, mergeAttributes } from "@tiptap/core";
import { attr } from "../shared/attrs";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    section: {
      insertSection: (layout?: string) => ReturnType;
    };
  }
}

export const Section = Node.create({
  name: "section",
  group: "block",
  content: "column+",
  draggable: true,

  addAttributes() {
    return {
      layout: attr("1-1"),
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="section"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    const layout = node.attrs.layout || "1-1";
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "section",
        class: `cms-section cms-section--${layout}`,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      insertSection:
        (layout: string = "1-1") =>
        ({ commands }) => {
          const colCount = layout.split("-").length;
          const columns = Array.from({ length: colCount }).map(() => ({
            type: "column",
            content: [{ type: "paragraph" }],
          }));
          return commands.insertContent({
            type: this.name,
            attrs: { layout },
            content: columns,
          });
        },
    };
  },
});

export default Section;
