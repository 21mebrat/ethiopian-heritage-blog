import type { Editor } from "@tiptap/react";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";

export type MediaNodeType = "imageBlock" | "videoBlock" | "mediaTextBlock";

export interface SelectedMedia {
  type: MediaNodeType;
  node: ProseMirrorNode;
  pos: number;
  attrs: Record<string, unknown>;
}

const MEDIA_TYPES: MediaNodeType[] = ["imageBlock", "videoBlock", "mediaTextBlock"];

export function getSelectedMedia(editor: Editor | null): SelectedMedia | null {
  if (!editor) return null;

  const { selection } = editor.state;

  if (selection.node && MEDIA_TYPES.includes(selection.node.type.name as MediaNodeType)) {
    return {
      type: selection.node.type.name as MediaNodeType,
      node: selection.node,
      pos: selection.from,
      attrs: selection.node.attrs as Record<string, unknown>,
    };
  }

  const { $from } = selection;
  for (let depth = $from.depth; depth > 0; depth--) {
    const node = $from.node(depth);
    if (MEDIA_TYPES.includes(node.type.name as MediaNodeType)) {
      return {
        type: node.type.name as MediaNodeType,
        node,
        pos: $from.before(depth),
        attrs: node.attrs as Record<string, unknown>,
      };
    }
  }

  return null;
}

export function getMediaDomRect(editor: Editor, pos: number): DOMRect | null {
  const dom = editor.view.nodeDOM(pos);
  if (dom instanceof HTMLElement) {
    const frame = dom.querySelector(".cms-media-resize-host");
    if (frame instanceof HTMLElement) return frame.getBoundingClientRect();
    return dom.getBoundingClientRect();
  }
  return null;
}
